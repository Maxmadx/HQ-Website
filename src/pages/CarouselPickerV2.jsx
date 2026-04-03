/**
 * CAROUSEL PICKER V2 - 20 Variations based on V14
 * Varying: image size, shadows, animations, number placement
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Picker from '../components/Picker';

const slides = [
  {
    id: 0,
    title: 'Discovery Flight',
    image: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
    description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations.',
    cta: 'Learn More',
    link: '/training/trial-lessons'
  },
  {
    id: 1,
    title: 'Private Pilot Licence',
    image: '/assets/images/used-aircraft/r66/gold-on-pad.jpg',
    description: 'The obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
    cta: 'Learn More',
    link: '/training/ppl'
  },
  {
    id: 2,
    title: 'Commercial Pilot Licence',
    image: '/assets/images/used-aircraft/r66/r66s-italy.jpg',
    description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. 155 hrs of flying time post licence is required.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 3,
    title: 'Type Rating',
    image: '/assets/images/used-aircraft/r66/ghver.jpg',
    description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by flight training.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 4,
    title: 'Night Rating',
    image: '/assets/images/used-aircraft/r66/r66-turbine-n7021z.jpg',
    description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. 100 hrs of flying time post licence is required.',
    cta: 'Learn More',
    link: '/training'
  },
  {
    id: 5,
    title: 'Self-Fly Hire',
    image: '/assets/images/used-aircraft/r66/hkcc.jpg',
    description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements on a short or long term basis.',
    cta: 'Learn More',
    link: '/services'
  }
];

// ============================================
// V1: BASE (Original V14)
// ============================================
function Carousel1({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--1">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span className="carousel__current">{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--1 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--1 .carousel__left { position: relative; }
        .carousel--1 .carousel__images { position: absolute; inset: 0; }
        .carousel--1 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--1 .carousel__images img.active { opacity: 1; }
        .carousel--1 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--1 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--1 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--1 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--1 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--1 .carousel__content { flex: 1; }
        .carousel--1 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--1 .carousel__current { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; }
        .carousel--1 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--1 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--1 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--1 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--1 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--1 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V2: GIANT NUMBER OVERLAY
// ============================================
function Carousel2({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--2">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
        <div className="carousel__number-overlay">
          <span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--2 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--2 .carousel__left { position: relative; }
        .carousel--2 .carousel__images { position: absolute; inset: 0; }
        .carousel--2 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--2 .carousel__images img.active { opacity: 1; }
        .carousel--2 .carousel__number-overlay { position: absolute; bottom: 2rem; left: 2rem; font-family: 'Share Tech Mono', monospace; font-size: 8rem; font-weight: 700; color: rgba(255,255,255,0.15); line-height: 1; z-index: 10; }
        .carousel--2 .carousel__number-overlay span { display: block; animation: slideUp2 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideUp2 { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--2 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--2 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--2 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--2 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--2 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--2 .carousel__content { flex: 1; }
        .carousel--2 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--2 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--2 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--2 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--2 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--2 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V3: INSET IMAGE WITH SHADOW
// ============================================
function Carousel3({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--3">
      <div className="carousel__left">
        <div className="carousel__image-frame">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span className="carousel__current">{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--3 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--3 .carousel__left { position: relative; display: flex; align-items: center; justify-content: center; padding: 2.5rem; }
        .carousel--3 .carousel__image-frame { position: relative; width: 100%; height: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1); }
        .carousel--3 .carousel__image-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform: scale(1.05); }
        .carousel--3 .carousel__image-frame img.active { opacity: 1; transform: scale(1); }
        .carousel--3 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--3 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--3 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--3 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--3 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--3 .carousel__content { flex: 1; }
        .carousel--3 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--3 .carousel__current { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; }
        .carousel--3 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--3 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--3 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--3 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--3 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--3 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V4: NUMBER BESIDE TITLE
// ============================================
function Carousel4({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--4">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__title-row">
            <span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span>
            <h3>{slides[activeSlide].title}</h3>
          </div>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--4 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--4 .carousel__left { position: relative; }
        .carousel--4 .carousel__images { position: absolute; inset: 0; }
        .carousel--4 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--4 .carousel__images img.active { opacity: 1; }
        .carousel--4 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--4 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--4 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--4 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--4 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--4 .carousel__content { flex: 1; }
        .carousel--4 .carousel__title-row { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; }
        .carousel--4 .carousel__current { font-family: 'Share Tech Mono', monospace; font-size: 3rem; font-weight: 700; color: rgba(255,255,255,0.3); line-height: 1; animation: fadeNum4 0.4s ease; }
        @keyframes fadeNum4 { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--4 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0; text-transform: uppercase; }
        .carousel--4 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--4 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--4 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--4 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--4 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V5: SLIDE ANIMATION + FLOATING NUMBER
// ============================================
function Carousel5({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--5">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__floating-number" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--5 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; position: relative; }
        .carousel--5 .carousel__left { position: relative; overflow: hidden; }
        .carousel--5 .carousel__images { position: absolute; inset: 0; }
        .carousel--5 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: translateX(-30px); transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--5 .carousel__images img.active { opacity: 1; transform: translateX(0); }
        .carousel--5 .carousel__floating-number { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Share Tech Mono', monospace; font-size: 12rem; font-weight: 700; color: rgba(255,255,255,0.08); z-index: 5; pointer-events: none; animation: pulseNum5 0.6s ease; }
        @keyframes pulseNum5 { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        .carousel--5 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; position: relative; z-index: 10; }
        .carousel--5 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--5 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--5 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--5 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--5 .carousel__content { flex: 1; }
        .carousel--5 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--5 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--5 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--5 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--5 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--5 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V6: SMALLER IMAGE WITH GLOW
// ============================================
function Carousel6({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--6">
      <div className="carousel__left">
        <div className="carousel__image-glow">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__counter"><span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--6 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--6 .carousel__left { position: relative; display: flex; align-items: center; justify-content: center; padding: 3rem; }
        .carousel--6 .carousel__image-glow { position: relative; width: 85%; aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; box-shadow: 0 0 60px rgba(255,255,255,0.1), 0 0 100px rgba(255,255,255,0.05); }
        .carousel--6 .carousel__image-glow img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--6 .carousel__image-glow img.active { opacity: 1; }
        .carousel--6 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--6 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; overflow: hidden; }
        .carousel--6 .carousel__current { font-size: 5rem; font-weight: 700; color: rgba(255,255,255,0.15); line-height: 1; display: block; animation: dropIn6 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes dropIn6 { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .carousel--6 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--6 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--6 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--6 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--6 .carousel__content { flex: 1; }
        .carousel--6 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--6 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--6 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--6 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--6 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--6 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V7: VERTICAL NUMBER + ZOOM IMAGE
// ============================================
function Carousel7({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--7">
      <div className="carousel__number-bar">
        <span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span>
      </div>
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--7 { display: grid; grid-template-columns: 60px 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--7 .carousel__number-bar { background: #111; display: flex; align-items: center; justify-content: center; border-right: 1px solid rgba(255,255,255,0.1); }
        .carousel--7 .carousel__number-bar span { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; color: rgba(255,255,255,0.5); writing-mode: vertical-rl; text-orientation: mixed; animation: fadeIn7 0.3s ease; }
        @keyframes fadeIn7 { from { opacity: 0; } to { opacity: 1; } }
        .carousel--7 .carousel__left { position: relative; overflow: hidden; }
        .carousel--7 .carousel__images { position: absolute; inset: 0; }
        .carousel--7 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.1); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--7 .carousel__images img.active { opacity: 1; transform: scale(1); }
        .carousel--7 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--7 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--7 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--7 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--7 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--7 .carousel__content { flex: 1; }
        .carousel--7 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--7 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--7 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--7 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--7 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--7 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V8: GRADIENT OVERLAY + BOTTOM NUMBER
// ============================================
function Carousel8({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--8">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
        <div className="carousel__gradient"></div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__bottom">
          <div className="carousel__sticks">
            {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
          </div>
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
        </div>
      </div>
      <style>{`
        .carousel--8 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--8 .carousel__left { position: relative; }
        .carousel--8 .carousel__images { position: absolute; inset: 0; }
        .carousel--8 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--8 .carousel__images img.active { opacity: 1; }
        .carousel--8 .carousel__gradient { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 50%, rgba(26,26,26,0.9) 100%); pointer-events: none; }
        .carousel--8 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--8 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--8 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--8 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--8 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--8 .carousel__content { flex: 1; }
        .carousel--8 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--8 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--8 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--8 .carousel__bottom { display: flex; align-items: center; gap: 2rem; margin-top: auto; }
        .carousel--8 .carousel__sticks { display: flex; gap: 0.5rem; flex: 1; }
        .carousel--8 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--8 .carousel__stick.active { background: #fff; }
        .carousel--8 .carousel__counter span { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 700; color: rgba(255,255,255,0.4); animation: count8 0.3s ease; }
        @keyframes count8 { from { opacity: 0; transform: scale(1.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

// ============================================
// V9: CIRCLE NUMBER BADGE
// ============================================
function Carousel9({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--9">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
        <div className="carousel__badge" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--9 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--9 .carousel__left { position: relative; }
        .carousel--9 .carousel__images { position: absolute; inset: 0; }
        .carousel--9 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--9 .carousel__images img.active { opacity: 1; }
        .carousel--9 .carousel__badge { position: absolute; top: 2rem; right: 2rem; width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; color: #1a1a1a; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: popIn9 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes popIn9 { from { transform: scale(0); } to { transform: scale(1); } }
        .carousel--9 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--9 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--9 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--9 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--9 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--9 .carousel__content { flex: 1; }
        .carousel--9 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--9 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--9 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--9 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--9 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--9 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V10: CROSSFADE + OUTLINE NUMBER
// ============================================
function Carousel10({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--10">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--10 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--10 .carousel__left { position: relative; }
        .carousel--10 .carousel__images { position: absolute; inset: 0; }
        .carousel--10 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: grayscale(100%); transition: all 0.8s ease; }
        .carousel--10 .carousel__images img.active { opacity: 1; filter: grayscale(0%); }
        .carousel--10 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--10 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--10 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--10 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--10 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--10 .carousel__content { flex: 1; }
        .carousel--10 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--10 .carousel__current { font-size: 5rem; font-weight: 700; line-height: 1; color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.3); animation: stroke10 0.5s ease; }
        @keyframes stroke10 { from { opacity: 0; -webkit-text-stroke-width: 0px; } to { opacity: 1; -webkit-text-stroke-width: 2px; } }
        .carousel--10 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--10 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--10 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--10 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--10 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--10 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V11: SPLIT DIAGONAL + NUMBER
// ============================================
function Carousel11({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--11">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
        <div className="carousel__diagonal"></div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--11 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--11 .carousel__left { position: relative; }
        .carousel--11 .carousel__images { position: absolute; inset: 0; }
        .carousel--11 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--11 .carousel__images img.active { opacity: 1; }
        .carousel--11 .carousel__diagonal { position: absolute; top: 0; right: -50px; bottom: 0; width: 100px; background: #1a1a1a; transform: skewX(-5deg); }
        .carousel--11 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--11 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--11 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--11 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--11 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--11 .carousel__content { flex: 1; }
        .carousel--11 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--11 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: block; animation: slideRight11 0.4s ease; }
        @keyframes slideRight11 { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--11 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--11 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--11 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--11 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--11 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--11 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V12: WIDER IMAGE + COMPACT TEXT
// ============================================
function Carousel12({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--12">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--12 { display: grid; grid-template-columns: 1.4fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--12 .carousel__left { position: relative; }
        .carousel--12 .carousel__images { position: absolute; inset: 0; }
        .carousel--12 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: all 0.5s ease; }
        .carousel--12 .carousel__images img.active { opacity: 1; }
        .carousel--12 .carousel__right { padding: 2rem 2.5rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--12 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
        .carousel--12 .carousel__counter span { font-size: 6rem; font-weight: 700; color: rgba(255,255,255,0.1); line-height: 1; animation: fade12 0.4s ease; }
        @keyframes fade12 { from { opacity: 0; } to { opacity: 1; } }
        .carousel--12 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .carousel--12 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--12 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--12 .carousel__tab.active { color: #fff; background: rgba(255,255,255,0.1); border-radius: 4px; }
        .carousel--12 .carousel__content { flex: 1; }
        .carousel--12 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--12 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.9rem; }
        .carousel--12 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--12 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--12 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--12 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V13: IMAGE BLUR TRANSITION
// ============================================
function Carousel13({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--13">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--13 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--13 .carousel__left { position: relative; }
        .carousel--13 .carousel__images { position: absolute; inset: 0; }
        .carousel--13 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: blur(10px); transform: scale(1.1); transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--13 .carousel__images img.active { opacity: 1; filter: blur(0); transform: scale(1); }
        .carousel--13 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--13 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--13 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--13 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--13 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--13 .carousel__content { flex: 1; }
        .carousel--13 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--13 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: block; animation: blur13 0.5s ease; }
        @keyframes blur13 { from { filter: blur(10px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
        .carousel--13 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--13 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--13 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--13 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--13 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--13 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V14: STACKED CARDS EFFECT
// ============================================
function Carousel14({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--14">
      <div className="carousel__left">
        <div className="carousel__stack">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__card ${idx === activeSlide ? 'active' : ''} ${idx < activeSlide ? 'passed' : ''}`}>
              <img src={slide.image} alt={slide.title} />
            </div>
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--14 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--14 .carousel__left { position: relative; display: flex; align-items: center; justify-content: center; padding: 3rem; }
        .carousel--14 .carousel__stack { position: relative; width: 85%; aspect-ratio: 4/3; }
        .carousel--14 .carousel__card { position: absolute; inset: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(20px) scale(0.9); opacity: 0.3; }
        .carousel--14 .carousel__card.active { transform: translateY(0) scale(1); opacity: 1; z-index: 10; }
        .carousel--14 .carousel__card.passed { transform: translateY(-20px) scale(0.95); opacity: 0; z-index: 5; }
        .carousel--14 .carousel__card img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--14 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--14 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--14 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--14 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--14 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--14 .carousel__content { flex: 1; }
        .carousel--14 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--14 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: block; animation: flip14 0.4s ease; }
        @keyframes flip14 { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; } }
        .carousel--14 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--14 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--14 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--14 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--14 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--14 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V15: SPLIT IMAGE REVEAL
// ============================================
function Carousel15({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--15">
      <div className="carousel__left">
        <div className="carousel__reveal" key={activeSlide}>
          <img src={slides[activeSlide].image} alt={slides[activeSlide].title} />
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--15 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--15 .carousel__left { position: relative; overflow: hidden; }
        .carousel--15 .carousel__reveal { position: absolute; inset: 0; animation: reveal15 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes reveal15 { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        .carousel--15 .carousel__reveal img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--15 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--15 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--15 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--15 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--15 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--15 .carousel__content { flex: 1; }
        .carousel--15 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; overflow: hidden; }
        .carousel--15 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: block; animation: slideUp15 0.5s ease; }
        @keyframes slideUp15 { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .carousel--15 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--15 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--15 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--15 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--15 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--15 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V16: POLAROID STYLE
// ============================================
function Carousel16({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--16">
      <div className="carousel__left">
        <div className="carousel__polaroid" key={activeSlide}>
          <img src={slides[activeSlide].image} alt={slides[activeSlide].title} />
          <div className="carousel__polaroid-number">{String(activeSlide + 1).padStart(2, '0')}</div>
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--16 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--16 .carousel__left { position: relative; display: flex; align-items: center; justify-content: center; padding: 3rem; background: #111; }
        .carousel--16 .carousel__polaroid { background: #fff; padding: 12px 12px 50px 12px; border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: drop16 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
        @keyframes drop16 { from { transform: scale(0.8) rotate(-5deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
        .carousel--16 .carousel__polaroid img { width: 280px; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .carousel--16 .carousel__polaroid-number { font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; color: #999; text-align: center; margin-top: 12px; }
        .carousel--16 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--16 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--16 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--16 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--16 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--16 .carousel__content { flex: 1; }
        .carousel--16 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--16 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--16 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--16 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--16 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--16 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V17: CINEMA BARS + BIG NUMBER
// ============================================
function Carousel17({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--17">
      <div className="carousel__left">
        <div className="carousel__cinema">
          <div className="carousel__bar-top"></div>
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
          <div className="carousel__bar-bottom"></div>
          <div className="carousel__cinema-number" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--17 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--17 .carousel__left { position: relative; }
        .carousel--17 .carousel__cinema { position: absolute; inset: 0; }
        .carousel--17 .carousel__cinema img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.6s ease; }
        .carousel--17 .carousel__cinema img.active { opacity: 1; }
        .carousel--17 .carousel__bar-top, .carousel--17 .carousel__bar-bottom { position: absolute; left: 0; right: 0; height: 40px; background: #000; z-index: 5; }
        .carousel--17 .carousel__bar-top { top: 0; }
        .carousel--17 .carousel__bar-bottom { bottom: 0; }
        .carousel--17 .carousel__cinema-number { position: absolute; bottom: 50px; right: 20px; font-family: 'Share Tech Mono', monospace; font-size: 5rem; font-weight: 700; color: rgba(255,255,255,0.2); z-index: 10; animation: fade17 0.4s ease; }
        @keyframes fade17 { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--17 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--17 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--17 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--17 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--17 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--17 .carousel__content { flex: 1; }
        .carousel--17 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--17 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--17 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--17 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--17 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--17 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V18: MINIMAL + OFFSET IMAGE
// ============================================
function Carousel18({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--18">
      <div className="carousel__left">
        <div className="carousel__offset-wrap">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--18 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: visible; position: relative; }
        .carousel--18 .carousel__left { position: relative; display: flex; align-items: center; padding: 2rem; }
        .carousel--18 .carousel__offset-wrap { position: relative; width: calc(100% + 60px); aspect-ratio: 4/3; margin-left: -30px; border-radius: 8px; overflow: hidden; box-shadow: 30px 30px 60px rgba(0,0,0,0.4); }
        .carousel--18 .carousel__offset-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: all 0.5s ease; }
        .carousel--18 .carousel__offset-wrap img.active { opacity: 1; }
        .carousel--18 .carousel__right { padding: 3rem 3rem 3rem 4rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--18 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 2rem; }
        .carousel--18 .carousel__counter span { font-size: 7rem; font-weight: 700; color: rgba(255,255,255,0.08); line-height: 1; display: block; animation: scale18 0.4s ease; }
        @keyframes scale18 { from { transform: scale(1.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .carousel--18 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .carousel--18 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--18 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--18 .carousel__tab.active { color: #fff; background: rgba(255,255,255,0.1); border-radius: 4px; }
        .carousel--18 .carousel__content { flex: 1; }
        .carousel--18 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--18 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--18 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--18 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--18 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--18 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V19: ROTATING NUMBER
// ============================================
function Carousel19({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--19">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--19 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--19 .carousel__left { position: relative; }
        .carousel--19 .carousel__images { position: absolute; inset: 0; }
        .carousel--19 .carousel__images img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: all 0.6s ease; transform: rotate(-2deg) scale(1.1); }
        .carousel--19 .carousel__images img.active { opacity: 1; transform: rotate(0deg) scale(1); }
        .carousel--19 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--19 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--19 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--19 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--19 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--19 .carousel__content { flex: 1; }
        .carousel--19 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; perspective: 500px; }
        .carousel--19 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: block; animation: rotate19 0.5s ease; transform-origin: left center; }
        @keyframes rotate19 { from { transform: rotateY(-90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }
        .carousel--19 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--19 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--19 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--19 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--19 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--19 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V20: BORDER FRAME + TYPING NUMBER
// ============================================
function Carousel20({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--20">
      <div className="carousel__left">
        <div className="carousel__frame">
          {slides.map((slide, idx) => (
            <img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />
          ))}
          <div className="carousel__frame-border"></div>
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>
          ))}
        </div>
        <div className="carousel__content">
          <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          <h3>{slides[activeSlide].title}</h3>
          <p>{slides[activeSlide].description}</p>
          <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta} →</Link>
        </div>
        <div className="carousel__sticks">
          {slides.map((_, idx) => (<div key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} />))}
        </div>
      </div>
      <style>{`
        .carousel--20 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1100px; margin: 0 auto; min-height: 500px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--20 .carousel__left { position: relative; display: flex; align-items: center; justify-content: center; padding: 2.5rem; }
        .carousel--20 .carousel__frame { position: relative; width: 100%; height: 100%; }
        .carousel--20 .carousel__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; border-radius: 4px; }
        .carousel--20 .carousel__frame img.active { opacity: 1; }
        .carousel--20 .carousel__frame-border { position: absolute; inset: -8px; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; pointer-events: none; }
        .carousel--20 .carousel__right { padding: 3rem; display: flex; flex-direction: column; color: #fff; }
        .carousel--20 .carousel__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1rem; }
        .carousel--20 .carousel__tab { padding: 0.4rem 0.75rem; background: none; border: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .carousel--20 .carousel__tab:hover { color: rgba(255,255,255,0.8); }
        .carousel--20 .carousel__tab.active { color: #fff; border-bottom: 2px solid #fff; margin-bottom: -1rem; padding-bottom: calc(0.4rem + 1rem - 2px); }
        .carousel--20 .carousel__content { flex: 1; }
        .carousel--20 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1rem; }
        .carousel--20 .carousel__counter span { font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.6); line-height: 1; display: inline-block; animation: type20 0.3s steps(2); }
        @keyframes type20 { from { width: 0; opacity: 0; } to { width: auto; opacity: 1; } }
        .carousel--20 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--20 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--20 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--20 .carousel__sticks { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--20 .carousel__stick { flex: 1; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .carousel--20 .carousel__stick.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V21: FADE (Original Carousel 1)
// ============================================
function Carousel21({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--21">
      <div className="carousel__slides">
        {slides.map((slide, idx) => (
          <div key={idx} className={`carousel__slide ${idx === activeSlide ? 'active' : ''}`}>
            <div className="carousel__image"><img src={slide.image} alt={slide.title} /></div>
            <div className="carousel__content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
        <div className="carousel__dots">
          {slides.map((_, idx) => (<button key={idx} className={`carousel__dot ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}
        </div>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
      </div>
      <style>{`
        .carousel--21 { position: relative; max-width: 900px; margin: 0 auto; }
        .carousel--21 .carousel__slides { position: relative; height: 500px; }
        .carousel--21 .carousel__slide { position: absolute; inset: 0; display: flex; gap: 3rem; align-items: center; opacity: 0; transition: opacity 0.6s ease; pointer-events: none; }
        .carousel--21 .carousel__slide.active { opacity: 1; pointer-events: auto; }
        .carousel--21 .carousel__image { flex: 1; height: 100%; }
        .carousel--21 .carousel__image img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .carousel--21 .carousel__content { flex: 1; padding: 2rem; }
        .carousel--21 .carousel__content h3 { font-size: 2rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--21 .carousel__content p { color: #666; line-height: 1.8; margin: 0 0 2rem; }
        .carousel--21 .carousel__btn { display: inline-block; padding: 1rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; transition: background 0.3s; }
        .carousel--21 .carousel__btn:hover { background: #333; }
        .carousel--21 .carousel__nav { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 2rem; }
        .carousel--21 .carousel__nav button { width: 40px; height: 40px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 1.2rem; transition: all 0.3s; }
        .carousel--21 .carousel__nav button:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .carousel--21 .carousel__dots { display: flex; gap: 0.5rem; }
        .carousel--21 .carousel__dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .carousel--21 .carousel__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V22: HORIZONTAL SLIDE (Original Carousel 2)
// ============================================
function Carousel22({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--22">
      <div className="carousel__track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
        {slides.map((slide, idx) => (
          <div key={idx} className="carousel__slide">
            <div className="carousel__image"><img src={slide.image} alt={slide.title} /></div>
            <div className="carousel__content">
              <span className="carousel__num">{String(idx + 1).padStart(2, '0')}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta} →</Link>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>‹</button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>›</button>
      <style>{`
        .carousel--22 { position: relative; max-width: 1000px; margin: 0 auto; overflow: hidden; }
        .carousel--22 .carousel__track { display: flex; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--22 .carousel__slide { flex: 0 0 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding: 2rem; box-sizing: border-box; }
        .carousel--22 .carousel__image { aspect-ratio: 4/3; overflow: hidden; border-radius: 12px; }
        .carousel--22 .carousel__image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--22 .carousel__content { display: flex; flex-direction: column; justify-content: center; }
        .carousel--22 .carousel__num { font-size: 4rem; font-weight: 100; color: #e0e0e0; line-height: 1; margin-bottom: 1rem; }
        .carousel--22 .carousel__content h3 { font-size: 1.75rem; font-weight: 600; margin: 0 0 1rem; }
        .carousel--22 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 2rem; }
        .carousel--22 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 2px solid #1a1a1a; padding-bottom: 0.25rem; width: fit-content; transition: gap 0.3s; }
        .carousel--22 .carousel__btn:hover { gap: 1rem; }
        .carousel--22 .carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border: none; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 50%; font-size: 2rem; cursor: pointer; z-index: 10; transition: all 0.3s; }
        .carousel--22 .carousel__arrow:hover { background: #1a1a1a; color: #fff; }
        .carousel--22 .carousel__arrow--prev { left: 1rem; }
        .carousel--22 .carousel__arrow--next { right: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V23: COVER FLOW 3D (Original Carousel 3)
// ============================================
function Carousel23({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--23">
      <div className="carousel__stage">
        {slides.map((slide, idx) => {
          const offset = idx - activeSlide;
          const isActive = idx === activeSlide;
          const translateX = offset * 200;
          const translateZ = isActive ? 100 : -100;
          const rotateY = offset * -25;
          const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3;
          const scale = isActive ? 1 : 0.8;
          return (
            <div key={idx} className={`carousel__card ${isActive ? 'active' : ''}`} style={{ transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`, opacity, zIndex: 10 - Math.abs(offset) }} onClick={() => setActiveSlide(idx)}>
              <img src={slide.image} alt={slide.title} />
              <div className="carousel__card-info"><h3>{slide.title}</h3></div>
            </div>
          );
        })}
      </div>
      <div className="carousel__info">
        <h3>{slides[activeSlide].title}</h3>
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>
      <div className="carousel__controls">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
        <span>{activeSlide + 1} / {slides.length}</span>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
      </div>
      <style>{`
        .carousel--23 { max-width: 1200px; margin: 0 auto; text-align: center; }
        .carousel--23 .carousel__stage { height: 350px; perspective: 1000px; display: flex; align-items: center; justify-content: center; position: relative; }
        .carousel--23 .carousel__card { position: absolute; width: 300px; height: 280px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .carousel--23 .carousel__card img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--23 .carousel__card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #fff; }
        .carousel--23 .carousel__card-info h3 { margin: 0; font-size: 1rem; font-weight: 600; }
        .carousel--23 .carousel__card.active { cursor: default; }
        .carousel--23 .carousel__info { margin-top: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
        .carousel--23 .carousel__info h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--23 .carousel__info p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
        .carousel--23 .carousel__btn { display: inline-block; padding: 0.75rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--23 .carousel__controls { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 2rem; }
        .carousel--23 .carousel__controls button { width: 40px; height: 40px; border: 2px solid #1a1a1a; background: transparent; cursor: pointer; font-size: 1rem; transition: all 0.3s; }
        .carousel--23 .carousel__controls button:hover { background: #1a1a1a; color: #fff; }
        .carousel--23 .carousel__controls span { font-size: 0.9rem; color: #999; }
      `}</style>
    </div>
  );
}

// ============================================
// V24: CARD STACK (Original Carousel 4)
// ============================================
function Carousel24({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--24">
      <div className="carousel__deck">
        {slides.map((slide, idx) => {
          const offset = idx - activeSlide;
          const isActive = idx === activeSlide;
          const isPast = offset < 0;
          return (
            <div key={idx} className={`carousel__card ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`} style={{ transform: isPast ? `translateX(-120%) rotate(-5deg)` : `translateY(${offset * 15}px) scale(${1 - offset * 0.05})`, opacity: isPast ? 0 : Math.max(0, 1 - offset * 0.2), zIndex: slides.length - Math.abs(offset) }}>
              <div className="carousel__card-inner">
                <div className="carousel__image"><img src={slide.image} alt={slide.title} /></div>
                <div className="carousel__content">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  {isActive && <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} disabled={activeSlide === 0}>Previous</button>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next →</button>
      </div>
      <style>{`
        .carousel--24 { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .carousel--24 .carousel__deck { position: relative; height: 450px; }
        .carousel--24 .carousel__card { position: absolute; top: 0; left: 50%; width: 90%; max-width: 600px; transform: translateX(-50%); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--24 .carousel__card.past { pointer-events: none; }
        .carousel--24 .carousel__card-inner { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden; }
        .carousel--24 .carousel__image { height: 250px; overflow: hidden; }
        .carousel--24 .carousel__image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--24 .carousel__content { padding: 2rem; }
        .carousel--24 .carousel__content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; }
        .carousel--24 .carousel__content p { color: #666; line-height: 1.6; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--24 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.8rem; border-radius: 4px; }
        .carousel--24 .carousel__nav { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
        .carousel--24 .carousel__nav button { padding: 0.75rem 2rem; background: transparent; border: 2px solid #1a1a1a; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: all 0.3s; }
        .carousel--24 .carousel__nav button:hover:not(:disabled) { background: #1a1a1a; color: #fff; }
        .carousel--24 .carousel__nav button:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

// ============================================
// V25: TABS + CENTER FOCUS (Original Carousel 5)
// ============================================
function Carousel25({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--25">
      <div className="carousel__tabs">
        {slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>))}
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>‹</button>
        <div className="carousel__viewport">
          {slides.map((slide, idx) => {
            const offset = idx - activeSlide;
            const isActive = idx === activeSlide;
            const isPrev = offset === -1 || (activeSlide === 0 && idx === slides.length - 1);
            const isNext = offset === 1 || (activeSlide === slides.length - 1 && idx === 0);
            let translateX = '0%'; let scale = 0.7; let opacity = 0;
            if (isActive) { translateX = '0%'; scale = 1; opacity = 1; }
            else if (isPrev) { translateX = '-85%'; scale = 0.85; opacity = 0.5; }
            else if (isNext) { translateX = '85%'; scale = 0.85; opacity = 0.5; }
            return (
              <div key={idx} className={`carousel__slide ${isActive ? 'active' : ''}`} style={{ transform: `translateX(${translateX}) scale(${scale})`, opacity, zIndex: isActive ? 10 : 5 }} onClick={() => !isActive && setActiveSlide(idx)}>
                <img src={slide.image} alt={slide.title} />
                <div className="carousel__overlay"><h3>{slide.title}</h3></div>
              </div>
            );
          })}
        </div>
        <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>›</button>
      </div>
      <div className="carousel__info">
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>
      <style>{`
        .carousel--25 { max-width: 1100px; margin: 0 auto; }
        .carousel--25 .carousel__tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 1rem; }
        .carousel--25 .carousel__tab { padding: 0.5rem 1rem; background: none; border: none; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; cursor: pointer; transition: color 0.3s; }
        .carousel--25 .carousel__tab:hover { color: #333; }
        .carousel--25 .carousel__tab.active { color: #1a1a1a; border-bottom: 2px solid #1a1a1a; margin-bottom: -1rem; padding-bottom: calc(0.5rem + 1rem - 2px); }
        .carousel--25 .carousel__body { position: relative; display: flex; align-items: center; justify-content: center; }
        .carousel--25 .carousel__viewport { position: relative; width: 100%; height: 400px; overflow: hidden; }
        .carousel--25 .carousel__slide { position: absolute; top: 0; left: 50%; width: 55%; height: 100%; margin-left: -27.5%; border-radius: 8px; overflow: hidden; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .carousel--25 .carousel__slide.active { cursor: default; }
        .carousel--25 .carousel__slide img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--25 .carousel__overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; }
        .carousel--25 .carousel__overlay h3 { margin: 0; font-size: 1.25rem; }
        .carousel--25 .carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 45px; height: 45px; border: none; background: rgba(255,255,255,0.95); border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 20; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: all 0.3s; }
        .carousel--25 .carousel__arrow:hover { background: #1a1a1a; color: #fff; }
        .carousel--25 .carousel__arrow--prev { left: 1rem; }
        .carousel--25 .carousel__arrow--next { right: 1rem; }
        .carousel--25 .carousel__info { text-align: center; max-width: 600px; margin: 2rem auto 0; }
        .carousel--25 .carousel__info p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
        .carousel--25 .carousel__btn { display: inline-block; padding: 1rem 2.5rem; background: transparent; color: #1a1a1a; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; border: 2px solid #1a1a1a; transition: all 0.3s; }
        .carousel--25 .carousel__btn:hover { background: #1a1a1a; color: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V26: VERTICAL SIDEBAR (Original Carousel 6)
// ============================================
function Carousel26({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--26">
      <div className="carousel__sidebar">
        {slides.map((slide, idx) => (
          <button key={idx} className={`carousel__sidebar-item ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
            <span className="carousel__sidebar-num">{String(idx + 1).padStart(2, '0')}</span>
            <span className="carousel__sidebar-title">{slide.title}</span>
          </button>
        ))}
      </div>
      <div className="carousel__main">
        <div className="carousel__track" style={{ transform: `translateY(-${activeSlide * 100}%)` }}>
          {slides.map((slide, idx) => (
            <div key={idx} className="carousel__slide">
              <div className="carousel__image"><img src={slide.image} alt={slide.title} /></div>
              <div className="carousel__content">
                <span className="carousel__label">Training Course</span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .carousel--26 { display: flex; max-width: 1100px; margin: 0 auto; height: 500px; gap: 2rem; }
        .carousel--26 .carousel__sidebar { width: 200px; display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0; }
        .carousel--26 .carousel__sidebar-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: transparent; border: none; text-align: left; cursor: pointer; transition: all 0.3s; border-left: 3px solid transparent; }
        .carousel--26 .carousel__sidebar-item:hover { background: #f5f5f5; }
        .carousel--26 .carousel__sidebar-item.active { background: #f5f5f5; border-left-color: #1a1a1a; }
        .carousel--26 .carousel__sidebar-num { font-size: 0.75rem; color: #999; font-family: monospace; }
        .carousel--26 .carousel__sidebar-title { font-size: 0.85rem; font-weight: 500; }
        .carousel--26 .carousel__main { flex: 1; overflow: hidden; border-radius: 12px; }
        .carousel--26 .carousel__track { height: 100%; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--26 .carousel__slide { height: 100%; display: grid; grid-template-columns: 1fr 1fr; }
        .carousel--26 .carousel__image { height: 100%; }
        .carousel--26 .carousel__image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--26 .carousel__content { padding: 3rem; display: flex; flex-direction: column; justify-content: center; background: #f9f9f9; }
        .carousel--26 .carousel__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-bottom: 1rem; }
        .carousel--26 .carousel__content h3 { font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; }
        .carousel--26 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 2rem; }
        .carousel--26 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.8rem; width: fit-content; }
      `}</style>
    </div>
  );
}

// ============================================
// V27: FILMSTRIP (Original Carousel 7)
// ============================================
function Carousel27({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--27">
      <div className="carousel__content">
        <span className="carousel__counter">{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <h3>{slides[activeSlide].title}</h3>
        <p>{slides[activeSlide].description}</p>
        <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
      </div>
      <div className="carousel__strip-container">
        <div className="carousel__strip" style={{ transform: `translateX(calc(-${activeSlide * 180}px + 50% - 90px))` }}>
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__thumb ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
              <img src={slide.image} alt={slide.title} />
              <div className="carousel__thumb-overlay"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel__nav">
        <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>← Previous</button>
        <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next →</button>
      </div>
      <style>{`
        .carousel--27 { max-width: 1000px; margin: 0 auto; text-align: center; }
        .carousel--27 .carousel__content { margin-bottom: 3rem; }
        .carousel--27 .carousel__counter { font-family: monospace; font-size: 0.85rem; color: #999; margin-bottom: 1rem; display: block; }
        .carousel--27 .carousel__content h3 { font-size: 2.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--27 .carousel__content p { max-width: 500px; margin: 0 auto 2rem; color: #666; line-height: 1.7; }
        .carousel--27 .carousel__btn { display: inline-block; padding: 1rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; }
        .carousel--27 .carousel__strip-container { overflow: hidden; padding: 1rem 0; }
        .carousel--27 .carousel__strip { display: flex; gap: 1rem; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); width: fit-content; }
        .carousel--27 .carousel__thumb { width: 160px; height: 120px; flex-shrink: 0; border-radius: 8px; overflow: hidden; cursor: pointer; position: relative; transition: all 0.3s; }
        .carousel--27 .carousel__thumb img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--27 .carousel__thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); transition: opacity 0.3s; }
        .carousel--27 .carousel__thumb:hover .carousel__thumb-overlay { opacity: 0.6; }
        .carousel--27 .carousel__thumb.active { transform: scale(1.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .carousel--27 .carousel__thumb.active .carousel__thumb-overlay { opacity: 0; }
        .carousel--27 .carousel__nav { display: flex; justify-content: center; gap: 2rem; margin-top: 2rem; }
        .carousel--27 .carousel__nav button { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid #ddd; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; }
        .carousel--27 .carousel__nav button:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V28: SPLIT SCREEN DARK (Original Carousel 8)
// ============================================
function Carousel28({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--28">
      <div className="carousel__left">
        <div className="carousel__images">
          {slides.map((slide, idx) => (<div key={idx} className={`carousel__image ${idx === activeSlide ? 'active' : ''}`}><img src={slide.image} alt={slide.title} /></div>))}
        </div>
      </div>
      <div className="carousel__right">
        <div className="carousel__content-stack">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__content ${idx === activeSlide ? 'active' : ''}`}>
              <span className="carousel__num">{String(idx + 1).padStart(2, '0')}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn">{slide.cta} →</Link>
            </div>
          ))}
        </div>
        <div className="carousel__progress">
          {slides.map((_, idx) => (<button key={idx} className={`carousel__progress-item ${idx === activeSlide ? 'active' : ''} ${idx < activeSlide ? 'past' : ''}`} onClick={() => setActiveSlide(idx)} />))}
        </div>
        <div className="carousel__nav">
          <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>←</button>
          <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button>
        </div>
      </div>
      <style>{`
        .carousel--28 { display: grid; grid-template-columns: 1fr 1fr; max-width: 1200px; margin: 0 auto; min-height: 550px; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .carousel--28 .carousel__left { position: relative; overflow: hidden; }
        .carousel--28 .carousel__images { height: 100%; }
        .carousel--28 .carousel__image { position: absolute; inset: 0; opacity: 0; transition: opacity 0.6s ease, transform 0.6s ease; transform: scale(1.1); }
        .carousel--28 .carousel__image.active { opacity: 1; transform: scale(1); }
        .carousel--28 .carousel__image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--28 .carousel__right { padding: 4rem; display: flex; flex-direction: column; justify-content: center; color: #fff; position: relative; }
        .carousel--28 .carousel__content-stack { position: relative; min-height: 300px; }
        .carousel--28 .carousel__content { position: absolute; top: 0; left: 0; right: 0; opacity: 0; transform: translateY(20px); transition: all 0.5s ease; pointer-events: none; }
        .carousel--28 .carousel__content.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .carousel--28 .carousel__num { display: block; font-size: 3rem; font-weight: 100; color: rgba(255,255,255,0.2); margin-bottom: 1rem; }
        .carousel--28 .carousel__content h3 { font-size: 2rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--28 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 2rem; }
        .carousel--28 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; }
        .carousel--28 .carousel__btn:hover { border-color: #fff; }
        .carousel--28 .carousel__progress { display: flex; gap: 0.5rem; margin-top: auto; }
        .carousel--28 .carousel__progress-item { flex: 1; height: 3px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; transition: background 0.3s; }
        .carousel--28 .carousel__progress-item.active, .carousel--28 .carousel__progress-item.past { background: #fff; }
        .carousel--28 .carousel__nav { position: absolute; bottom: 4rem; right: 4rem; display: flex; gap: 0.5rem; }
        .carousel--28 .carousel__nav button { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.3); background: transparent; color: #fff; cursor: pointer; font-size: 1rem; transition: all 0.3s; }
        .carousel--28 .carousel__nav button:hover { background: #fff; color: #1a1a1a; border-color: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V29: MINIMAL ARROWS (Original Carousel 9)
// ============================================
function Carousel29({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--29">
      <div className="carousel__container">
        {slides.map((slide, idx) => (
          <div key={idx} className={`carousel__slide ${idx === activeSlide ? 'active' : ''}`}>
            <div className="carousel__inner">
              <div className="carousel__image"><img src={slide.image} alt={slide.title} /></div>
              <div className="carousel__content">
                <div className="carousel__header">
                  <span className="carousel__index">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="carousel__divider"></span>
                  <span className="carousel__total">{String(slides.length).padStart(2, '0')}</span>
                </div>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn">{slide.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel__arrow carousel__arrow--prev" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
      <style>{`
        .carousel--29 { position: relative; max-width: 1000px; margin: 0 auto; padding: 0 4rem; }
        .carousel--29 .carousel__container { position: relative; overflow: hidden; }
        .carousel--29 .carousel__slide { display: none; }
        .carousel--29 .carousel__slide.active { display: block; animation: minimalFadeIn29 0.4s ease; }
        @keyframes minimalFadeIn29 { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--29 .carousel__inner { display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; }
        .carousel--29 .carousel__image { aspect-ratio: 4/3; border-radius: 4px; overflow: hidden; }
        .carousel--29 .carousel__image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--29 .carousel__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; font-family: monospace; font-size: 0.9rem; color: #999; }
        .carousel--29 .carousel__divider { width: 30px; height: 1px; background: #ddd; }
        .carousel--29 .carousel__content h3 { font-size: 2rem; font-weight: 600; margin: 0 0 1.5rem; line-height: 1.2; }
        .carousel--29 .carousel__content p { color: #666; line-height: 1.8; margin: 0 0 2rem; }
        .carousel--29 .carousel__btn { display: inline-block; padding: 1rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; }
        .carousel--29 .carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border: 1px solid #e0e0e0; background: #fff; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; z-index: 10; }
        .carousel--29 .carousel__arrow:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .carousel--29 .carousel__arrow--prev { left: 0; }
        .carousel--29 .carousel__arrow--next { right: 0; }
      `}</style>
    </div>
  );
}

// ============================================
// V30: EDITORIAL MAGAZINE (Original Carousel 10)
// ============================================
function Carousel30({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--30">
      <div className="carousel__hero">
        <div className="carousel__hero-images">
          {slides.map((slide, idx) => (<div key={idx} className={`carousel__hero-image ${idx === activeSlide ? 'active' : ''}`}><img src={slide.image} alt={slide.title} /></div>))}
        </div>
        <div className="carousel__hero-overlay">
          <span className="carousel__category">Training</span>
          <h2 className="carousel__title">{slides[activeSlide].title}</h2>
        </div>
      </div>
      <div className="carousel__bar">
        <div className="carousel__counter">
          <span className="carousel__current">{String(activeSlide + 1).padStart(2, '0')}</span>
          <span className="carousel__separator">/</span>
          <span className="carousel__total">{String(slides.length).padStart(2, '0')}</span>
        </div>
        <div className="carousel__description"><p>{slides[activeSlide].description}</p></div>
        <div className="carousel__actions"><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
        <div className="carousel__controls">
          <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>Prev</button>
          <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>Next</button>
        </div>
      </div>
      <div className="carousel__thumbnails">
        {slides.map((slide, idx) => (<button key={idx} className={`carousel__thumb ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><img src={slide.image} alt={slide.title} /><span>{slide.title}</span></button>))}
      </div>
      <style>{`
        .carousel--30 { max-width: 1200px; margin: 0 auto; }
        .carousel--30 .carousel__hero { position: relative; height: 450px; overflow: hidden; border-radius: 8px; }
        .carousel--30 .carousel__hero-images { height: 100%; }
        .carousel--30 .carousel__hero-image { position: absolute; inset: 0; opacity: 0; transform: scale(1.05); transition: all 0.8s ease; }
        .carousel--30 .carousel__hero-image.active { opacity: 1; transform: scale(1); }
        .carousel--30 .carousel__hero-image img { width: 100%; height: 100%; object-fit: cover; }
        .carousel--30 .carousel__hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 4rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #fff; }
        .carousel--30 .carousel__category { display: inline-block; padding: 0.25rem 0.75rem; background: #fff; color: #1a1a1a; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem; }
        .carousel--30 .carousel__title { font-size: 3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: -0.02em; }
        .carousel--30 .carousel__bar { display: grid; grid-template-columns: auto 1fr auto auto; gap: 3rem; align-items: center; padding: 2rem 0; border-bottom: 1px solid #e0e0e0; }
        .carousel--30 .carousel__counter { font-family: monospace; font-size: 1.25rem; display: flex; align-items: baseline; gap: 0.25rem; }
        .carousel--30 .carousel__counter .carousel__current { font-weight: 700; }
        .carousel--30 .carousel__separator, .carousel--30 .carousel__counter .carousel__total { color: #999; }
        .carousel--30 .carousel__description p { margin: 0; color: #666; line-height: 1.6; max-width: 400px; }
        .carousel--30 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }
        .carousel--30 .carousel__controls { display: flex; gap: 0.5rem; }
        .carousel--30 .carousel__controls button { padding: 0.75rem 1.25rem; background: transparent; border: 1px solid #ddd; cursor: pointer; font-size: 0.8rem; transition: all 0.3s; }
        .carousel--30 .carousel__controls button:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .carousel--30 .carousel__thumbnails { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-top: 2rem; }
        .carousel--30 .carousel__thumb { background: none; border: none; cursor: pointer; text-align: left; padding: 0; opacity: 0.5; transition: opacity 0.3s; }
        .carousel--30 .carousel__thumb:hover, .carousel--30 .carousel__thumb.active { opacity: 1; }
        .carousel--30 .carousel__thumb img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem; }
        .carousel--30 .carousel__thumb span { font-size: 0.75rem; font-weight: 500; }
      `}</style>
    </div>
  );
}

// ============================================
// V31: ORIGINAL V11 LAYOUT (Image | Divider | Content)
// ============================================
function Carousel31({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--31">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
              <span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="carousel__tab-title">{slide.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="carousel__body">
        <div className="carousel__main">
          <div className="carousel__image">
            {slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={`text-${activeSlide}`}>
              <h3>{slides[activeSlide].title}</h3>
              <p>{slides[activeSlide].description}</p>
              <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="carousel__sticks">
        {slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}
      </div>
      <style>{`
        .carousel--31 { max-width: 1000px; margin: 0 auto; }
        .carousel--31 .carousel__tabs-wrapper { position: relative; }
        .carousel--31 .carousel__tabs-wrapper::before, .carousel--31 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60px; pointer-events: none; z-index: 1; }
        .carousel--31 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6 0%, transparent 100%); }
        .carousel--31 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6 0%, transparent 100%); }
        .carousel--31 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; padding-left: 40px; padding-right: 40px; }
        .carousel--31 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--31 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; transition: all 0.3s; flex-shrink: 0; white-space: nowrap; }
        .carousel--31 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; transition: color 0.3s; }
        .carousel--31 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; transition: color 0.3s; }
        .carousel--31 .carousel__tab:hover .carousel__tab-num { color: #999; }
        .carousel--31 .carousel__tab:hover .carousel__tab-title { color: #333; }
        .carousel--31 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--31 .carousel__tab.active .carousel__tab-num { color: #666; }
        .carousel--31 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--31 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--31 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--31 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--31 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.02); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--31 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--31 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--31 .carousel__content { padding: 1.5rem 0; }
        .carousel--31 .carousel__counter { display: flex; align-items: baseline; gap: 0.25rem; font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; overflow: hidden; }
        .carousel--31 .carousel__current { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: inline-block; animation: slideUp31 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes slideUp31 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--31 .carousel__text-content { animation: fadeIn31 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.1s; opacity: 0; }
        @keyframes fadeIn31 { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--31 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--31 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--31 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--31 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--31 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; transition: background 0.3s; }
        .carousel--31 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V32: LONG ARROW THICK NAVIGATION
// ============================================
function Carousel32({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--32">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">
          {slides.map((slide, idx) => (
            <button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
              <span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="carousel__tab-title">{slide.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow carousel__arrow--prev" onClick={prevSlide}>
          <svg width="48" height="20" viewBox="0 0 48 20">
            <line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="carousel__main">
          <div className="carousel__image">
            {slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span className="carousel__current" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={`text-${activeSlide}`}>
              <h3>{slides[activeSlide].title}</h3>
              <p>{slides[activeSlide].description}</p>
              <Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link>
            </div>
          </div>
        </div>
        <button className="carousel__arrow carousel__arrow--next" onClick={nextSlide}>
          <svg width="48" height="20" viewBox="0 0 48 20">
            <line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="carousel__sticks">
        {slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}
      </div>
      <style>{`
        .carousel--32 { max-width: 1000px; margin: 0 auto; }
        .carousel--32 .carousel__tabs-wrapper { position: relative; }
        .carousel--32 .carousel__tabs-wrapper::before, .carousel--32 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60px; pointer-events: none; z-index: 1; }
        .carousel--32 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6 0%, transparent 100%); }
        .carousel--32 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6 0%, transparent 100%); }
        .carousel--32 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; padding-left: 40px; padding-right: 40px; }
        .carousel--32 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--32 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; transition: all 0.3s; flex-shrink: 0; white-space: nowrap; }
        .carousel--32 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; transition: color 0.3s; }
        .carousel--32 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; transition: color 0.3s; }
        .carousel--32 .carousel__tab:hover .carousel__tab-num { color: #999; }
        .carousel--32 .carousel__tab:hover .carousel__tab-title { color: #333; }
        .carousel--32 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--32 .carousel__tab.active .carousel__tab-num { color: #666; }
        .carousel--32 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--32 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--32 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; display: flex; align-items: center; justify-content: center; transition: all 0.3s; flex-shrink: 0; }
        .carousel--32 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--32 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--32 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--32 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.02); transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--32 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--32 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--32 .carousel__content { padding: 1.5rem 0; }
        .carousel--32 .carousel__counter { display: flex; align-items: baseline; gap: 0.25rem; font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; overflow: hidden; }
        .carousel--32 .carousel__current { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: inline-block; animation: slideUp32 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes slideUp32 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--32 .carousel__text-content { animation: fadeIn32 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.1s; opacity: 0; }
        @keyframes fadeIn32 { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--32 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--32 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--32 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--32 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--32 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; transition: background 0.3s; }
        .carousel--32 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V33: GIANT NUMBER OVERLAY ON IMAGE
// ============================================
function Carousel33({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--33">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-wrap">
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
            <div className="carousel__number-overlay" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--33 { max-width: 1000px; margin: 0 auto; }
        .carousel--33 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; }
        .carousel--33 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--33 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--33 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--33 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--33 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--33 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--33 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--33 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--33 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--33 .carousel__image-wrap { position: relative; }
        .carousel--33 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--33 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--33 .carousel__image img.active { opacity: 1; }
        .carousel--33 .carousel__number-overlay { position: absolute; bottom: 1rem; left: 1rem; font-family: 'Share Tech Mono', monospace; font-size: 6rem; font-weight: 700; color: rgba(255,255,255,0.2); line-height: 1; animation: slideUp33 0.5s ease; }
        @keyframes slideUp33 { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--33 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--33 .carousel__content { padding: 1.5rem 0; }
        .carousel--33 .carousel__text-content { animation: fadeIn33 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn33 { to { opacity: 1; } }
        .carousel--33 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--33 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--33 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--33 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--33 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--33 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V34: INSET IMAGE WITH DEEP SHADOW
// ============================================
function Carousel34({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--34">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-frame">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--34 { max-width: 1000px; margin: 0 auto; }
        .carousel--34 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--34 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--34 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--34 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--34 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--34 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--34 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--34 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--34 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--34 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--34 .carousel__image-frame { position: relative; aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05); margin: 1rem; }
        .carousel--34 .carousel__image-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.05); transition: all 0.6s ease; }
        .carousel--34 .carousel__image-frame img.active { opacity: 1; transform: scale(1); }
        .carousel--34 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--34 .carousel__content { padding: 1.5rem 0; }
        .carousel--34 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; overflow: hidden; }
        .carousel--34 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideUp34 0.5s ease; }
        @keyframes slideUp34 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--34 .carousel__text-content { animation: fadeIn34 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn34 { to { opacity: 1; } }
        .carousel--34 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--34 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--34 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--34 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--34 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--34 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V35: NUMBER BESIDE TITLE INLINE
// ============================================
function Carousel35({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--35">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__title-row"><span className="carousel__num" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span><h3>{slides[activeSlide].title}</h3></div>
            <div className="carousel__text-content" key={activeSlide}><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--35 { max-width: 1000px; margin: 0 auto; }
        .carousel--35 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--35 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--35 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--35 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--35 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--35 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--35 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--35 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--35 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--35 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--35 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--35 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--35 .carousel__image img.active { opacity: 1; }
        .carousel--35 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--35 .carousel__content { padding: 1.5rem 0; }
        .carousel--35 .carousel__title-row { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; }
        .carousel--35 .carousel__num { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #ccc; line-height: 1; animation: fadeNum35 0.4s ease; }
        @keyframes fadeNum35 { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--35 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; }
        .carousel--35 .carousel__text-content { animation: fadeIn35 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn35 { to { opacity: 1; } }
        .carousel--35 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--35 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--35 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--35 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--35 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V36: VERTICAL NUMBER BAR
// ============================================
function Carousel36({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--36">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__number-bar"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--36 { max-width: 1050px; margin: 0 auto; }
        .carousel--36 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--36 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--36 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--36 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--36 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--36 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--36 .carousel__body { display: flex; align-items: center; gap: 1rem; }
        .carousel--36 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--36 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--36 .carousel__number-bar { width: 50px; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px; flex-shrink: 0; }
        .carousel--36 .carousel__number-bar span { font-family: 'Share Tech Mono', monospace; font-size: 1.25rem; font-weight: 700; color: #999; writing-mode: vertical-rl; text-orientation: mixed; animation: fadeIn36 0.3s ease; }
        @keyframes fadeIn36 { from { opacity: 0; } to { opacity: 1; } }
        .carousel--36 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2.5rem; align-items: center; min-height: 350px; }
        .carousel--36 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--36 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.1); transition: all 0.6s ease; }
        .carousel--36 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--36 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--36 .carousel__content { padding: 1.5rem 0; }
        .carousel--36 .carousel__text-content { animation: fadeIn36 0.5s ease 0.1s forwards; opacity: 0; }
        .carousel--36 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--36 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--36 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--36 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--36 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--36 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V37: BLUR-TO-SHARP IMAGE TRANSITION
// ============================================
function Carousel37({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--37">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--37 { max-width: 1000px; margin: 0 auto; }
        .carousel--37 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--37 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--37 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--37 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--37 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--37 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--37 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--37 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--37 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--37 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--37 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--37 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: blur(15px); transform: scale(1.1); transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--37 .carousel__image img.active { opacity: 1; filter: blur(0); transform: scale(1); }
        .carousel--37 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--37 .carousel__content { padding: 1.5rem 0; }
        .carousel--37 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; overflow: hidden; }
        .carousel--37 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: blur37 0.5s ease; }
        @keyframes blur37 { from { filter: blur(10px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
        .carousel--37 .carousel__text-content { animation: fadeIn37 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn37 { to { opacity: 1; } }
        .carousel--37 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--37 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--37 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--37 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--37 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--37 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V38: CIRCLE BADGE NUMBER
// ============================================
function Carousel38({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--38">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__circle-badge" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
            <div className="carousel__text-content" key={`t-${activeSlide}`}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--38 { max-width: 1000px; margin: 0 auto; }
        .carousel--38 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--38 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--38 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--38 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--38 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--38 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--38 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--38 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--38 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--38 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--38 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--38 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--38 .carousel__image img.active { opacity: 1; }
        .carousel--38 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--38 .carousel__content { padding: 1.5rem 0; }
        .carousel--38 .carousel__circle-badge { width: 70px; height: 70px; border-radius: 50%; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; animation: pop38 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes pop38 { from { transform: scale(0); } to { transform: scale(1); } }
        .carousel--38 .carousel__text-content { animation: fadeIn38 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn38 { to { opacity: 1; } }
        .carousel--38 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--38 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--38 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--38 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--38 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--38 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V39: OUTLINE STROKE NUMBER
// ============================================
function Carousel39({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--39">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--39 { max-width: 1000px; margin: 0 auto; }
        .carousel--39 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--39 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--39 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--39 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--39 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--39 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--39 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--39 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--39 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--39 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--39 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--39 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: grayscale(100%); transition: all 0.6s ease; }
        .carousel--39 .carousel__image img.active { opacity: 1; filter: grayscale(0); }
        .carousel--39 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--39 .carousel__content { padding: 1.5rem 0; }
        .carousel--39 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--39 .carousel__counter span { font-size: 5rem; font-weight: 700; color: transparent; -webkit-text-stroke: 2px #999; line-height: 1; display: block; animation: draw39 0.6s ease; }
        @keyframes draw39 { from { -webkit-text-stroke-color: transparent; } to { -webkit-text-stroke-color: #999; } }
        .carousel--39 .carousel__text-content { animation: fadeIn39 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn39 { to { opacity: 1; } }
        .carousel--39 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--39 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--39 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--39 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--39 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--39 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V40: POLAROID FRAME
// ============================================
function Carousel40({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--40">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__polaroid">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--40 { max-width: 1000px; margin: 0 auto; }
        .carousel--40 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--40 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--40 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--40 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--40 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--40 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--40 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--40 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--40 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--40 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--40 .carousel__polaroid { position: relative; background: #fff; padding: 12px 12px 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); transform: rotate(-2deg); }
        .carousel--40 .carousel__polaroid img { position: relative; width: 100%; aspect-ratio: 4/3; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; display: none; }
        .carousel--40 .carousel__polaroid img.active { opacity: 1; display: block; animation: drop40 0.5s ease; }
        @keyframes drop40 { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .carousel--40 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--40 .carousel__content { padding: 1.5rem 0; }
        .carousel--40 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--40 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideUp40 0.5s ease; }
        @keyframes slideUp40 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--40 .carousel__text-content { animation: fadeIn40 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn40 { to { opacity: 1; } }
        .carousel--40 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--40 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--40 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--40 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--40 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--40 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V41: WIDER IMAGE RATIO
// ============================================
function Carousel41({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--41">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--41 { max-width: 1100px; margin: 0 auto; }
        .carousel--41 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--41 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--41 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--41 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--41 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--41 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--41 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--41 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--41 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--41 .carousel__main { flex: 1; display: grid; grid-template-columns: 1.5fr auto 1fr; gap: 2.5rem; align-items: center; min-height: 350px; }
        .carousel--41 .carousel__image { position: relative; aspect-ratio: 16/10; border-radius: 8px; overflow: hidden; }
        .carousel--41 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--41 .carousel__image img.active { opacity: 1; }
        .carousel--41 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--41 .carousel__content { padding: 1.5rem 0; }
        .carousel--41 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--41 .carousel__counter span { font-size: 6rem; font-weight: 700; color: #eee; line-height: 1; display: block; animation: fadeNum41 0.4s ease; }
        @keyframes fadeNum41 { from { opacity: 0; } to { opacity: 1; } }
        .carousel--41 .carousel__text-content { animation: fadeIn41 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn41 { to { opacity: 1; } }
        .carousel--41 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--41 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--41 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--41 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--41 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--41 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V42: CLIP-PATH REVEAL
// ============================================
function Carousel42({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--42">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--42 { max-width: 1000px; margin: 0 auto; }
        .carousel--42 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--42 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--42 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--42 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--42 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--42 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--42 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--42 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--42 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--42 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--42 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--42 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; clip-path: inset(0 100% 0 0); transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--42 .carousel__image img.active { clip-path: inset(0 0 0 0); }
        .carousel--42 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--42 .carousel__content { padding: 1.5rem 0; }
        .carousel--42 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--42 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideUp42 0.5s ease; }
        @keyframes slideUp42 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--42 .carousel__text-content { animation: fadeIn42 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn42 { to { opacity: 1; } }
        .carousel--42 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--42 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--42 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--42 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--42 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--42 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V43: ROUNDED GLOW
// ============================================
function Carousel43({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--43">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-glow">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--43 { max-width: 1000px; margin: 0 auto; }
        .carousel--43 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--43 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--43 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--43 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--43 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--43 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--43 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--43 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--43 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--43 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--43 .carousel__image-glow { position: relative; aspect-ratio: 4/3; border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(0,0,0,0.15), 0 0 100px rgba(0,0,0,0.05); }
        .carousel--43 .carousel__image-glow img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--43 .carousel__image-glow img.active { opacity: 1; }
        .carousel--43 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--43 .carousel__content { padding: 1.5rem 0; }
        .carousel--43 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--43 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideUp43 0.5s ease; }
        @keyframes slideUp43 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--43 .carousel__text-content { animation: fadeIn43 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn43 { to { opacity: 1; } }
        .carousel--43 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--43 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--43 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--43 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--43 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--43 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V44: TILTED IMAGE
// ============================================
function Carousel44({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--44">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--44 { max-width: 1000px; margin: 0 auto; }
        .carousel--44 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--44 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--44 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--44 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--44 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--44 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--44 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--44 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--44 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--44 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--44 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; transform: rotate(3deg); box-shadow: 0 15px 40px rgba(0,0,0,0.2); }
        .carousel--44 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: rotate(-5deg) scale(1.1); transition: all 0.6s ease; }
        .carousel--44 .carousel__image img.active { opacity: 1; transform: rotate(0) scale(1); }
        .carousel--44 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--44 .carousel__content { padding: 1.5rem 0; }
        .carousel--44 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--44 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: tilt44 0.5s ease; }
        @keyframes tilt44 { from { opacity: 0; transform: rotate(-10deg); } to { opacity: 1; transform: rotate(0); } }
        .carousel--44 .carousel__text-content { animation: fadeIn44 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn44 { to { opacity: 1; } }
        .carousel--44 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--44 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--44 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--44 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--44 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--44 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V45: FLOATING CENTER NUMBER
// ============================================
function Carousel45({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--45">
      <div className="carousel__floating-num" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--45 { max-width: 1000px; margin: 0 auto; position: relative; }
        .carousel--45 .carousel__floating-num { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Share Tech Mono', monospace; font-size: 15rem; font-weight: 700; color: rgba(0,0,0,0.03); z-index: 0; pointer-events: none; animation: pulse45 0.6s ease; }
        @keyframes pulse45 { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        .carousel--45 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; position: relative; z-index: 1; }
        .carousel--45 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--45 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--45 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--45 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--45 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--45 .carousel__body { display: flex; align-items: center; gap: 1.5rem; position: relative; z-index: 1; }
        .carousel--45 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--45 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--45 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--45 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--45 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--45 .carousel__image img.active { opacity: 1; }
        .carousel--45 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--45 .carousel__content { padding: 1.5rem 0; }
        .carousel--45 .carousel__text-content { animation: fadeIn45 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn45 { to { opacity: 1; } }
        .carousel--45 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--45 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--45 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--45 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; position: relative; z-index: 1; }
        .carousel--45 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--45 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V46: GRADIENT OVERLAY ON IMAGE
// ============================================
function Carousel46({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--46">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-wrap">
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
            <div className="carousel__gradient"></div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--46 { max-width: 1000px; margin: 0 auto; }
        .carousel--46 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--46 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--46 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--46 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--46 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--46 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--46 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--46 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--46 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--46 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--46 .carousel__image-wrap { position: relative; }
        .carousel--46 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--46 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--46 .carousel__image img.active { opacity: 1; }
        .carousel--46 .carousel__gradient { position: absolute; inset: 0; border-radius: 8px; background: linear-gradient(135deg, rgba(100,100,255,0.2) 0%, transparent 50%, rgba(255,100,100,0.2) 100%); pointer-events: none; }
        .carousel--46 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--46 .carousel__content { padding: 1.5rem 0; }
        .carousel--46 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--46 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideUp46 0.5s ease; }
        @keyframes slideUp46 { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .carousel--46 .carousel__text-content { animation: fadeIn46 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn46 { to { opacity: 1; } }
        .carousel--46 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--46 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--46 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--46 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--46 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--46 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V47: BORDER FRAME IMAGE
// ============================================
function Carousel47({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--47">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-frame">
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
            <div className="carousel__frame-border"></div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--47 { max-width: 1000px; margin: 0 auto; }
        .carousel--47 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--47 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--47 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--47 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--47 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--47 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--47 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--47 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--47 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--47 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--47 .carousel__image-frame { position: relative; padding: 1rem; }
        .carousel--47 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 4px; overflow: hidden; }
        .carousel--47 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--47 .carousel__image img.active { opacity: 1; }
        .carousel--47 .carousel__frame-border { position: absolute; inset: 0; border: 2px solid #ddd; border-radius: 8px; pointer-events: none; }
        .carousel--47 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--47 .carousel__content { padding: 1.5rem 0; }
        .carousel--47 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--47 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: type47 0.3s steps(2); }
        @keyframes type47 { from { width: 0; opacity: 0; } to { width: auto; opacity: 1; } }
        .carousel--47 .carousel__text-content { animation: fadeIn47 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn47 { to { opacity: 1; } }
        .carousel--47 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--47 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--47 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--47 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--47 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--47 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V48: ZOOM IN IMAGE
// ============================================
function Carousel48({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--48">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--48 { max-width: 1000px; margin: 0 auto; }
        .carousel--48 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--48 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--48 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--48 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--48 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--48 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--48 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--48 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--48 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--48 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--48 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--48 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.3); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .carousel--48 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--48 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--48 .carousel__content { padding: 1.5rem 0; }
        .carousel--48 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--48 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: scale48 0.5s ease; }
        @keyframes scale48 { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .carousel--48 .carousel__text-content { animation: fadeIn48 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn48 { to { opacity: 1; } }
        .carousel--48 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--48 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--48 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--48 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--48 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--48 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V49: OFFSET BREAKING IMAGE
// ============================================
function Carousel49({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--49">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--49 { max-width: 1000px; margin: 0 auto; }
        .carousel--49 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--49 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--49 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--49 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--49 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--49 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--49 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--49 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--49 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--49 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--49 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: visible; margin-right: 30px; }
        .carousel--49 .carousel__image img { position: absolute; inset: 0; width: calc(100% + 30px); height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; box-shadow: 15px 15px 40px rgba(0,0,0,0.2); transition: all 0.5s ease; transform: translateX(-20px); }
        .carousel--49 .carousel__image img.active { opacity: 1; transform: translateX(0); }
        .carousel--49 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--49 .carousel__content { padding: 1.5rem 0; }
        .carousel--49 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--49 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: slideIn49 0.5s ease; }
        @keyframes slideIn49 { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--49 .carousel__text-content { animation: fadeIn49 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn49 { to { opacity: 1; } }
        .carousel--49 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--49 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--49 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--49 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--49 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--49 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V50: NUMBER BEHIND IMAGE
// ============================================
function Carousel50({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--50">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image-wrap">
            <div className="carousel__bg-number" key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</div>
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--50 { max-width: 1000px; margin: 0 auto; }
        .carousel--50 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--50 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--50 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--50 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--50 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--50 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--50 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--50 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--50 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--50 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--50 .carousel__image-wrap { position: relative; }
        .carousel--50 .carousel__bg-number { position: absolute; top: -30px; left: -20px; font-family: 'Share Tech Mono', monospace; font-size: 10rem; font-weight: 700; color: #f0f0f0; line-height: 1; z-index: 0; animation: fadeIn50 0.4s ease; }
        @keyframes fadeIn50 { from { opacity: 0; } to { opacity: 1; } }
        .carousel--50 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; z-index: 1; }
        .carousel--50 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--50 .carousel__image img.active { opacity: 1; }
        .carousel--50 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--50 .carousel__content { padding: 1.5rem 0; }
        .carousel--50 .carousel__text-content { animation: fadeText50 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeText50 { to { opacity: 1; } }
        .carousel--50 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--50 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--50 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--50 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--50 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--50 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V51: ELASTIC BOUNCE
// ============================================
function Carousel51({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--51">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--51 { max-width: 1000px; margin: 0 auto; }
        .carousel--51 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--51 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--51 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--51 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--51 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--51 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--51 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--51 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--51 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--51 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--51 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; }
        .carousel--51 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(0.8); transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .carousel--51 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--51 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--51 .carousel__content { padding: 1.5rem 0; }
        .carousel--51 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--51 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: bounce51 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes bounce51 { from { transform: scale(0); } to { transform: scale(1); } }
        .carousel--51 .carousel__text-content { animation: fadeIn51 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn51 { to { opacity: 1; } }
        .carousel--51 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--51 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--51 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--51 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--51 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--51 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V52: STACKED CARDS EFFECT
// ============================================
function Carousel52({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--52">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__cards">
            <div className="carousel__card carousel__card--back"></div>
            <div className="carousel__card carousel__card--mid"></div>
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__counter"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--52 { max-width: 1000px; margin: 0 auto; }
        .carousel--52 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--52 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--52 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--52 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--52 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--52 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--52 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--52 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--52 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--52 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--52 .carousel__cards { position: relative; padding: 20px 20px 30px 10px; }
        .carousel--52 .carousel__card { position: absolute; border-radius: 8px; background: #e8e8e8; }
        .carousel--52 .carousel__card--back { inset: 20px 10px 10px 20px; transform: rotate(3deg); }
        .carousel--52 .carousel__card--mid { inset: 10px 15px 20px 15px; transform: rotate(-1deg); background: #f0f0f0; }
        .carousel--52 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .carousel--52 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--52 .carousel__image img.active { opacity: 1; animation: stack52 0.5s ease; }
        @keyframes stack52 { from { transform: translateY(-20px) rotate(5deg); opacity: 0; } to { transform: translateY(0) rotate(0); opacity: 1; } }
        .carousel--52 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--52 .carousel__content { padding: 1.5rem 0; }
        .carousel--52 .carousel__counter { font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; }
        .carousel--52 .carousel__counter span { font-size: 4rem; font-weight: 700; color: #999; line-height: 1; display: block; animation: flip52 0.5s ease; }
        @keyframes flip52 { from { transform: rotateX(-90deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; } }
        .carousel--52 .carousel__text-content { animation: fadeIn52 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn52 { to { opacity: 1; } }
        .carousel--52 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--52 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--52 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--52 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--52 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--52 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V53: GIANT NUMBER CENTERED IN IMAGE (Based on V49)
// ============================================
function Carousel53({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--53">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">
            {slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}
            <div className="carousel__giant-number"><span key={activeSlide}>{String(activeSlide + 1).padStart(2, '0')}</span></div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content" key={activeSlide}><h3>{slides[activeSlide].title}</h3><p>{slides[activeSlide].description}</p><Link to={slides[activeSlide].link} className="carousel__btn">{slides[activeSlide].cta}</Link></div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__sticks">{slides.map((_, idx) => (<button key={idx} className={`carousel__stick ${idx <= activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      <style>{`
        .carousel--53 { max-width: 1000px; margin: 0 auto; }
        .carousel--53 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; }
        .carousel--53 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--53 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; }
        .carousel--53 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; }
        .carousel--53 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--53 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--53 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--53 .carousel__arrow { padding: 0.75rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--53 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--53 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; min-height: 350px; }
        .carousel--53 .carousel__image { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; margin-right: 30px; box-shadow: 15px 15px 40px rgba(0,0,0,0.2); }
        .carousel--53 .carousel__image img { position: absolute; inset: 0; width: calc(100% + 30px); height: 100%; object-fit: cover; opacity: 0; transition: all 0.5s ease; transform: translateX(-20px); }
        .carousel--53 .carousel__image img.active { opacity: 1; transform: translateX(0); }
        .carousel--53 .carousel__giant-number { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .carousel--53 .carousel__giant-number span { font-family: 'Share Tech Mono', monospace; font-size: 12rem; font-weight: 900; color: rgba(255,255,255,0.25); line-height: 1; text-shadow: 0 4px 20px rgba(0,0,0,0.3); animation: scaleIn53 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes scaleIn53 { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .carousel--53 .carousel__divider { width: 1px; height: 180px; background: linear-gradient(to bottom, transparent, #ddd, transparent); }
        .carousel--53 .carousel__content { padding: 1.5rem 0; }
        .carousel--53 .carousel__text-content { animation: fadeIn53 0.5s ease 0.1s forwards; opacity: 0; }
        @keyframes fadeIn53 { to { opacity: 1; } }
        .carousel--53 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--53 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--53 .carousel__btn { display: inline-block; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--53 .carousel__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .carousel--53 .carousel__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; }
        .carousel--53 .carousel__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V54: NUMBER NEXT TO TITLE (Based on V49)
// ============================================
function Carousel54({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);

  return (
    <div className="carousel carousel--54">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper">
                      <span className="carousel__inline-number" key={idx === activeSlide ? `num-${activeSlide}` : undefined}>{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--54 { max-width: 1000px; margin: 0 auto; }
        .carousel--54 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--54 .carousel__tabs-wrapper::before,
        .carousel--54 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--54 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .carousel--54 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .carousel--54 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .carousel--54 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--54 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--54 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--54 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--54 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--54 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--54 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--54 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--54 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--54 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--54 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--54 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--54 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--54 .carousel__image::after { content: ''; position: absolute; bottom: -20px; left: 5%; width: 90%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%); z-index: -1; filter: blur(3px); }
        .carousel--54 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; box-shadow: 8px 8px 24px rgba(0,0,0,0.15); transition: opacity 0.5s ease; z-index: 2; }
        .carousel--54 .carousel__image img.active { opacity: 1; }
        .carousel--54 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--54 .carousel__content { display: flex; align-items: center; }
        .carousel--54 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--54 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--54 .carousel__number-wrapper::before,
        .carousel--54 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ccc; }
        .carousel--54 .carousel__content h3 { text-align: center; }
        .carousel--54 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #999; line-height: 1; animation: slideLeft54 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideLeft54 { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .carousel--54 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--54 .carousel__text-content::after { content: ''; position: absolute; bottom: -20px; left: 5%; width: 90%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%); z-index: -1; filter: blur(3px); }
        .carousel--54 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--54 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--54 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--54 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; }
        .carousel--54 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--54 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--54 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--54 .carousel__btn:hover::before { width: 100%; }
        .carousel--54 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--54 .carousel__btn span { position: relative; z-index: 1; }
        .carousel--54 .carousel__btn-chevron { position: relative; z-index: 1; transition: transform 0.3s ease; }
        .carousel--54 .carousel__btn:hover .carousel__btn-chevron { transform: translateX(3px); }
        .carousel--54 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V55: DARK MODE (Based on V54)
// ============================================
function Carousel55({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--55">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--55 { max-width: 1000px; margin: 0 auto; background: #1a1a1a; padding: 2rem; border-radius: 16px; }
        .carousel--55 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--55 .carousel__tabs-wrapper::before, .carousel--55 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--55 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #1a1a1a, transparent); }
        .carousel--55 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #1a1a1a, transparent); }
        .carousel--55 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #333; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--55 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--55 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--55 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #555; }
        .carousel--55 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; white-space: nowrap; }
        .carousel--55 .carousel__tab.active { border-bottom: 2px solid #fff; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--55 .carousel__tab.active .carousel__tab-title { color: #fff; }
        .carousel--55 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--55 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #555; transition: all 0.3s ease; }
        .carousel--55 .carousel__arrow:hover { color: #fff; }
        .carousel--55 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--55 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--55 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--55 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--55 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--55 .carousel__image img.active { opacity: 1; }
        .carousel--55 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #444, transparent); align-self: center; }
        .carousel--55 .carousel__content { display: flex; align-items: center; }
        .carousel--55 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--55 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--55 .carousel__number-wrapper::before, .carousel--55 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #444; }
        .carousel--55 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #666; line-height: 1; }
        .carousel--55 .carousel__text-content { position: relative; display: grid; background: #252525; border-radius: 12px; padding: 1.5rem; }
        .carousel--55 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--55 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--55 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--55 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--55 .carousel__content p { color: #999; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--55 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fff; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--55 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #1a1a1a; transition: width 0.4s ease; z-index: 0; }
        .carousel--55 .carousel__btn:hover::before { width: 100%; }
        .carousel--55 .carousel__btn:hover { color: #fff; }
        .carousel--55 .carousel__btn span, .carousel--55 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--55 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #444, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V75: LIGHT MODE (Based on V55)
// ============================================
function Carousel75({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--75">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--75 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .carousel--75 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--75 .carousel__tabs-wrapper::before, .carousel--75 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--75 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--75 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--75 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--75 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--75 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--75 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #ccc; }
        .carousel--75 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--75 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--75 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--75 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--75 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.3s ease; }
        .carousel--75 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--75 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--75 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--75 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--75 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--75 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--75 .carousel__image img.active { opacity: 1; }
        .carousel--75 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--75 .carousel__content { display: flex; align-items: center; }
        .carousel--75 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--75 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--75 .carousel__number-wrapper::before, .carousel--75 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ddd; }
        .carousel--75 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #ccc; line-height: 1; }
        .carousel--75 .carousel__text-content { position: relative; display: grid; background: #f8f8f8; border-radius: 12px; padding: 1.5rem; }
        .carousel--75 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--75 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--75 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--75 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #1a1a1a; }
        .carousel--75 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--75 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--75 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--75 .carousel__btn:hover::before { width: 100%; }
        .carousel--75 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--75 .carousel__btn span, .carousel--75 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--75 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V76: LIGHT MODE + IMAGE RIGHT + PROGRESS (Based on V75)
// ============================================
function Carousel76({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--76">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--76 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06); }
        .carousel--76 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--76 .carousel__tabs-wrapper::before, .carousel--76 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--76 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--76 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--76 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--76 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--76 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--76 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #ccc; }
        .carousel--76 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--76 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--76 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--76 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--76 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.3s ease; }
        .carousel--76 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--76 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--76 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--76 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--76 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--76 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--76 .carousel__image img.active { opacity: 1; }
        .carousel--76 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--76 .carousel__content { display: flex; align-items: center; }
        .carousel--76 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--76 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--76 .carousel__number-wrapper::before, .carousel--76 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ddd; }
        .carousel--76 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #ccc; line-height: 1; }
        .carousel--76 .carousel__text-content { position: relative; display: grid; background: #f8f8f8; border-radius: 12px; padding: 1.5rem; }
        .carousel--76 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--76 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--76 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--76 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #1a1a1a; }
        .carousel--76 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--76 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--76 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--76 .carousel__btn:hover::before { width: 100%; }
        .carousel--76 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--76 .carousel__btn span, .carousel--76 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--76 .carousel__progress { height: 2px; background: #e8e8e8; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--76 .carousel__progress-bar { height: 100%; background: #1a1a1a; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V77: DARK CONTENT CARD + IMAGE RIGHT + PROGRESS (Based on V76)
// ============================================
function Carousel77({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--77">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--77 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06); }
        .carousel--77 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--77 .carousel__tabs-wrapper::before, .carousel--77 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--77 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--77 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--77 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--77 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--77 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--77 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #ccc; }
        .carousel--77 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--77 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--77 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--77 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--77 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.3s ease; }
        .carousel--77 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--77 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--77 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--77 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--77 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--77 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--77 .carousel__image img.active { opacity: 1; }
        .carousel--77 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #444, transparent); align-self: center; }
        .carousel--77 .carousel__content { display: flex; align-items: center; }
        .carousel--77 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--77 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--77 .carousel__number-wrapper::before, .carousel--77 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #444; }
        .carousel--77 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #666; line-height: 1; }
        .carousel--77 .carousel__text-content { position: relative; display: grid; background: #1a1a1a; border-radius: 12px; padding: 1.5rem; }
        .carousel--77 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--77 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--77 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--77 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--77 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--77 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fff; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--77 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #1a1a1a; transition: width 0.4s ease; z-index: 0; }
        .carousel--77 .carousel__btn:hover::before { width: 100%; }
        .carousel--77 .carousel__btn:hover { color: #fff; }
        .carousel--77 .carousel__btn span, .carousel--77 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--77 .carousel__progress { height: 2px; background: #e8e8e8; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--77 .carousel__progress-bar { height: 100%; background: #1a1a1a; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V78: DEEP SHADOW + SCALE IMAGE ANIMATION (Based on V76)
// ============================================
function Carousel78({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--78">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--78 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .carousel--78 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--78 .carousel__tabs-wrapper::before, .carousel--78 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--78 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--78 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--78 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--78 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--78 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--78 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #ccc; }
        .carousel--78 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--78 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--78 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--78 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--78 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.3s ease; }
        .carousel--78 .carousel__arrow:hover { color: #1a1a1a; transform: scale(1.1); }
        .carousel--78 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--78 .carousel__image { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .carousel--78 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.1); transition: opacity 0.6s ease, transform 0.6s ease; }
        .carousel--78 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--78 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--78 .carousel__content { display: flex; align-items: center; }
        .carousel--78 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--78 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--78 .carousel__number-wrapper::before, .carousel--78 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ddd; }
        .carousel--78 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #ccc; line-height: 1; }
        .carousel--78 .carousel__text-content { position: relative; display: grid; background: #f8f8f8; border-radius: 12px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .carousel--78 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--78 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--78 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--78 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #1a1a1a; }
        .carousel--78 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--78 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; border-radius: 6px; }
        .carousel--78 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--78 .carousel__btn:hover::before { width: 100%; }
        .carousel--78 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--78 .carousel__btn span, .carousel--78 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--78 .carousel__progress { height: 3px; background: #e8e8e8; margin-top: 2rem; border-radius: 2px; overflow: hidden; }
        .carousel--78 .carousel__progress-bar { height: 100%; background: linear-gradient(90deg, #1a1a1a, #444); transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V79: NAVY BLUE THEME + SLIDE UP IMAGE (Based on V77)
// ============================================
function Carousel79({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--79">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--79 { max-width: 1000px; margin: 0 auto; background: #f0f4f8; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(30,58,95,0.15); }
        .carousel--79 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--79 .carousel__tabs-wrapper::before, .carousel--79 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--79 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #f0f4f8, transparent); }
        .carousel--79 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #f0f4f8, transparent); }
        .carousel--79 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #c5d5e8; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--79 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--79 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--79 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #8ca3be; }
        .carousel--79 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b8299; white-space: nowrap; }
        .carousel--79 .carousel__tab.active { border-bottom: 2px solid #1e3a5f; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--79 .carousel__tab.active .carousel__tab-title { color: #1e3a5f; }
        .carousel--79 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--79 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #8ca3be; transition: all 0.3s ease; }
        .carousel--79 .carousel__arrow:hover { color: #1e3a5f; }
        .carousel--79 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--79 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(30,58,95,0.25); }
        .carousel--79 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .carousel--79 .carousel__image img.active { opacity: 1; transform: translateY(0); }
        .carousel--79 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #1e3a5f, transparent); align-self: center; }
        .carousel--79 .carousel__content { display: flex; align-items: center; }
        .carousel--79 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--79 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--79 .carousel__number-wrapper::before, .carousel--79 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #1e3a5f; }
        .carousel--79 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #1e3a5f; line-height: 1; }
        .carousel--79 .carousel__text-content { position: relative; display: grid; background: #1e3a5f; border-radius: 12px; padding: 1.5rem; }
        .carousel--79 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--79 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--79 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--79 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--79 .carousel__content p { color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--79 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fff; color: #1e3a5f; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--79 .carousel__btn:hover { background: #c5d5e8; }
        .carousel--79 .carousel__btn span, .carousel--79 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--79 .carousel__progress { height: 2px; background: #c5d5e8; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--79 .carousel__progress-bar { height: 100%; background: #1e3a5f; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V80: EMERALD GREEN + GLOW EFFECT (Based on V76)
// ============================================
function Carousel80({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--80">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--80 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 10px rgba(16,185,129,0.1); }
        .carousel--80 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--80 .carousel__tabs-wrapper::before, .carousel--80 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--80 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--80 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--80 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #d1fae5; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--80 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--80 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--80 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #6ee7b7; }
        .carousel--80 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--80 .carousel__tab.active { border-bottom: 2px solid #10b981; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--80 .carousel__tab.active .carousel__tab-title { color: #10b981; }
        .carousel--80 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--80 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #6ee7b7; transition: all 0.3s ease; }
        .carousel--80 .carousel__arrow:hover { color: #10b981; }
        .carousel--80 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--80 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 0 40px rgba(16,185,129,0.4); }
        .carousel--80 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--80 .carousel__image img.active { opacity: 1; }
        .carousel--80 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #10b981, transparent); align-self: center; }
        .carousel--80 .carousel__content { display: flex; align-items: center; }
        .carousel--80 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--80 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--80 .carousel__number-wrapper::before, .carousel--80 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #10b981; }
        .carousel--80 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #10b981; line-height: 1; }
        .carousel--80 .carousel__text-content { position: relative; display: grid; background: #ecfdf5; border-radius: 12px; padding: 1.5rem; }
        .carousel--80 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--80 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--80 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--80 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #065f46; }
        .carousel--80 .carousel__content p { color: #047857; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--80 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #10b981; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--80 .carousel__btn:hover { background: #059669; box-shadow: 0 0 20px rgba(16,185,129,0.5); }
        .carousel--80 .carousel__btn span, .carousel--80 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--80 .carousel__progress { height: 2px; background: #d1fae5; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--80 .carousel__progress-bar { height: 100%; background: #10b981; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V81: WARM SUNSET + ROTATE IMAGE (Based on V77)
// ============================================
function Carousel81({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--81">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--81 { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(245,158,11,0.2); }
        .carousel--81 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--81 .carousel__tabs-wrapper::before, .carousel--81 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--81 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fef3c7, transparent); }
        .carousel--81 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fde68a, transparent); }
        .carousel--81 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #fbbf24; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--81 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--81 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--81 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #d97706; }
        .carousel--81 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; white-space: nowrap; }
        .carousel--81 .carousel__tab.active { border-bottom: 2px solid #b45309; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--81 .carousel__tab.active .carousel__tab-title { color: #78350f; }
        .carousel--81 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--81 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #d97706; transition: all 0.3s ease; }
        .carousel--81 .carousel__arrow:hover { color: #b45309; }
        .carousel--81 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--81 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(180,83,9,0.3); }
        .carousel--81 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: rotate(-2deg) scale(1.05); transition: opacity 0.5s ease, transform 0.5s ease; }
        .carousel--81 .carousel__image img.active { opacity: 1; transform: rotate(0) scale(1); }
        .carousel--81 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #b45309, transparent); align-self: center; }
        .carousel--81 .carousel__content { display: flex; align-items: center; }
        .carousel--81 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--81 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--81 .carousel__number-wrapper::before, .carousel--81 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #f59e0b; }
        .carousel--81 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #f59e0b; line-height: 1; }
        .carousel--81 .carousel__text-content { position: relative; display: grid; background: #78350f; border-radius: 12px; padding: 1.5rem; }
        .carousel--81 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--81 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--81 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--81 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fef3c7; }
        .carousel--81 .carousel__content p { color: rgba(254,243,199,0.8); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--81 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fbbf24; color: #78350f; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--81 .carousel__btn:hover { background: #f59e0b; }
        .carousel--81 .carousel__btn span, .carousel--81 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--81 .carousel__progress { height: 2px; background: rgba(180,83,9,0.3); margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--81 .carousel__progress-bar { height: 100%; background: #b45309; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V82: PURPLE GRADIENT + BLUR TRANSITION (Based on V76)
// ============================================
function Carousel82({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--82">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--82 { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(147,51,234,0.15); }
        .carousel--82 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--82 .carousel__tabs-wrapper::before, .carousel--82 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--82 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf5ff, transparent); }
        .carousel--82 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #f3e8ff, transparent); }
        .carousel--82 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e9d5ff; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--82 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--82 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--82 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #c084fc; }
        .carousel--82 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a855f7; white-space: nowrap; }
        .carousel--82 .carousel__tab.active { border-bottom: 2px solid #9333ea; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--82 .carousel__tab.active .carousel__tab-title { color: #7c3aed; }
        .carousel--82 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--82 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #c084fc; transition: all 0.3s ease; }
        .carousel--82 .carousel__arrow:hover { color: #9333ea; }
        .carousel--82 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--82 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(147,51,234,0.25); }
        .carousel--82 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: blur(10px); transition: opacity 0.5s ease, filter 0.5s ease; }
        .carousel--82 .carousel__image img.active { opacity: 1; filter: blur(0); }
        .carousel--82 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #9333ea, transparent); align-self: center; }
        .carousel--82 .carousel__content { display: flex; align-items: center; }
        .carousel--82 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--82 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--82 .carousel__number-wrapper::before, .carousel--82 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #9333ea; }
        .carousel--82 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #9333ea; line-height: 1; }
        .carousel--82 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(147,51,234,0.1); }
        .carousel--82 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--82 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--82 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--82 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #581c87; }
        .carousel--82 .carousel__content p { color: #7c3aed; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--82 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: linear-gradient(90deg, #9333ea, #7c3aed); color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--82 .carousel__btn:hover { box-shadow: 0 4px 20px rgba(147,51,234,0.4); transform: translateY(-2px); }
        .carousel--82 .carousel__btn span, .carousel--82 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--82 .carousel__progress { height: 2px; background: #e9d5ff; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--82 .carousel__progress-bar { height: 100%; background: linear-gradient(90deg, #9333ea, #7c3aed); transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V83: ROSE PINK + FLOAT SHADOW (Based on V77)
// ============================================
function Carousel83({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--83">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--83 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 15px rgba(244,63,94,0.1); }
        .carousel--83 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--83 .carousel__tabs-wrapper::before, .carousel--83 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--83 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--83 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--83 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #fecdd3; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--83 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--83 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--83 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #fda4af; }
        .carousel--83 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fb7185; white-space: nowrap; }
        .carousel--83 .carousel__tab.active { border-bottom: 2px solid #f43f5e; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--83 .carousel__tab.active .carousel__tab-title { color: #e11d48; }
        .carousel--83 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--83 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #fda4af; transition: all 0.3s ease; }
        .carousel--83 .carousel__arrow:hover { color: #f43f5e; }
        .carousel--83 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--83 .carousel__image { position: relative; border-radius: 8px; overflow: visible; }
        .carousel--83 .carousel__image::after { content: ''; position: absolute; bottom: -15px; left: 10%; width: 80%; height: 20px; background: radial-gradient(ellipse at center, rgba(244,63,94,0.35) 0%, transparent 70%); filter: blur(5px); z-index: -1; }
        .carousel--83 .carousel__image img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; position: absolute; inset: 0; transition: opacity 0.5s ease; }
        .carousel--83 .carousel__image img.active { opacity: 1; }
        .carousel--83 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #f43f5e, transparent); align-self: center; }
        .carousel--83 .carousel__content { display: flex; align-items: center; }
        .carousel--83 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--83 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--83 .carousel__number-wrapper::before, .carousel--83 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #fda4af; }
        .carousel--83 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #fda4af; line-height: 1; }
        .carousel--83 .carousel__text-content { position: relative; display: grid; background: #881337; border-radius: 12px; padding: 1.5rem; }
        .carousel--83 .carousel__text-content::after { content: ''; position: absolute; bottom: -15px; left: 10%; width: 80%; height: 20px; background: radial-gradient(ellipse at center, rgba(136,19,55,0.4) 0%, transparent 70%); filter: blur(5px); z-index: -1; }
        .carousel--83 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--83 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--83 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--83 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--83 .carousel__content p { color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--83 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fecdd3; color: #881337; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--83 .carousel__btn:hover { background: #fda4af; }
        .carousel--83 .carousel__btn span, .carousel--83 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--83 .carousel__progress { height: 2px; background: #fecdd3; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--83 .carousel__progress-bar { height: 100%; background: #f43f5e; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V84: SLATE GRAY + INSET SHADOW (Based on V76)
// ============================================
function Carousel84({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--84">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--84 { max-width: 1000px; margin: 0 auto; background: #f1f5f9; padding: 2rem; border-radius: 16px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.05); }
        .carousel--84 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--84 .carousel__tabs-wrapper::before, .carousel--84 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--84 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #f1f5f9, transparent); }
        .carousel--84 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #f1f5f9, transparent); }
        .carousel--84 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--84 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--84 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--84 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #94a3b8; }
        .carousel--84 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; white-space: nowrap; }
        .carousel--84 .carousel__tab.active { border-bottom: 2px solid #475569; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--84 .carousel__tab.active .carousel__tab-title { color: #334155; }
        .carousel--84 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--84 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #94a3b8; transition: all 0.3s ease; }
        .carousel--84 .carousel__arrow:hover { color: #475569; }
        .carousel--84 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--84 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: inset 0 0 30px rgba(0,0,0,0.15), 0 4px 15px rgba(0,0,0,0.1); }
        .carousel--84 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--84 .carousel__image img.active { opacity: 1; }
        .carousel--84 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #475569, transparent); align-self: center; }
        .carousel--84 .carousel__content { display: flex; align-items: center; }
        .carousel--84 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--84 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--84 .carousel__number-wrapper::before, .carousel--84 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #94a3b8; }
        .carousel--84 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #64748b; line-height: 1; }
        .carousel--84 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.05); }
        .carousel--84 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--84 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--84 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--84 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #1e293b; }
        .carousel--84 .carousel__content p { color: #475569; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--84 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #475569; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--84 .carousel__btn:hover { background: #334155; }
        .carousel--84 .carousel__btn span, .carousel--84 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--84 .carousel__progress { height: 2px; background: #cbd5e1; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--84 .carousel__progress-bar { height: 100%; background: #475569; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V85: CYAN ACCENT + SLIDE RIGHT IMAGE (Based on V77)
// ============================================
function Carousel85({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--85">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--85 { max-width: 1000px; margin: 0 auto; background: #ecfeff; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(6,182,212,0.15); }
        .carousel--85 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--85 .carousel__tabs-wrapper::before, .carousel--85 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--85 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #ecfeff, transparent); }
        .carousel--85 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #ecfeff, transparent); }
        .carousel--85 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #a5f3fc; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--85 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--85 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--85 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #22d3ee; }
        .carousel--85 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #06b6d4; white-space: nowrap; }
        .carousel--85 .carousel__tab.active { border-bottom: 2px solid #0891b2; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--85 .carousel__tab.active .carousel__tab-title { color: #0e7490; }
        .carousel--85 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--85 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #22d3ee; transition: all 0.3s ease; }
        .carousel--85 .carousel__arrow:hover { color: #0891b2; }
        .carousel--85 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--85 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 25px rgba(6,182,212,0.3); }
        .carousel--85 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: translateX(-30px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .carousel--85 .carousel__image img.active { opacity: 1; transform: translateX(0); }
        .carousel--85 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #0891b2, transparent); align-self: center; }
        .carousel--85 .carousel__content { display: flex; align-items: center; }
        .carousel--85 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--85 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--85 .carousel__number-wrapper::before, .carousel--85 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #22d3ee; }
        .carousel--85 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #22d3ee; line-height: 1; }
        .carousel--85 .carousel__text-content { position: relative; display: grid; background: #164e63; border-radius: 12px; padding: 1.5rem; }
        .carousel--85 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--85 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--85 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--85 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--85 .carousel__content p { color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--85 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #22d3ee; color: #164e63; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--85 .carousel__btn:hover { background: #06b6d4; }
        .carousel--85 .carousel__btn span, .carousel--85 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--85 .carousel__progress { height: 2px; background: #a5f3fc; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--85 .carousel__progress-bar { height: 100%; background: #0891b2; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V86: DARK CHARCOAL + BORDER GLOW (Based on V76)
// ============================================
function Carousel86({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--86">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--86 { max-width: 1000px; margin: 0 auto; background: #18181b; padding: 2rem; border-radius: 16px; box-shadow: 0 0 0 1px rgba(255,255,255,0.1); }
        .carousel--86 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--86 .carousel__tabs-wrapper::before, .carousel--86 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--86 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #18181b, transparent); }
        .carousel--86 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #18181b, transparent); }
        .carousel--86 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #3f3f46; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--86 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--86 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--86 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #52525b; }
        .carousel--86 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; white-space: nowrap; }
        .carousel--86 .carousel__tab.active { border-bottom: 2px solid #fff; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--86 .carousel__tab.active .carousel__tab-title { color: #fff; }
        .carousel--86 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--86 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #52525b; transition: all 0.3s ease; }
        .carousel--86 .carousel__arrow:hover { color: #fff; }
        .carousel--86 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--86 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #3f3f46; box-shadow: 0 0 20px rgba(255,255,255,0.05); }
        .carousel--86 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--86 .carousel__image img.active { opacity: 1; }
        .carousel--86 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #3f3f46, transparent); align-self: center; }
        .carousel--86 .carousel__content { display: flex; align-items: center; }
        .carousel--86 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--86 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--86 .carousel__number-wrapper::before, .carousel--86 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #3f3f46; }
        .carousel--86 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #52525b; line-height: 1; }
        .carousel--86 .carousel__text-content { position: relative; display: grid; background: #27272a; border-radius: 12px; padding: 1.5rem; border: 1px solid #3f3f46; }
        .carousel--86 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--86 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--86 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--86 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--86 .carousel__content p { color: #a1a1aa; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--86 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #fff; color: #18181b; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--86 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #3f3f46; transition: width 0.4s ease; z-index: 0; }
        .carousel--86 .carousel__btn:hover::before { width: 100%; }
        .carousel--86 .carousel__btn:hover { color: #fff; }
        .carousel--86 .carousel__btn span, .carousel--86 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--86 .carousel__progress { height: 2px; background: #3f3f46; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--86 .carousel__progress-bar { height: 100%; background: #fff; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V87: LIME GREEN + ZOOM OUT IMAGE (Based on V77)
// ============================================
function Carousel87({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--87">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--87 { max-width: 1000px; margin: 0 auto; background: #f7fee7; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(132,204,22,0.15); }
        .carousel--87 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--87 .carousel__tabs-wrapper::before, .carousel--87 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--87 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #f7fee7, transparent); }
        .carousel--87 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #f7fee7, transparent); }
        .carousel--87 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #bef264; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--87 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--87 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--87 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #a3e635; }
        .carousel--87 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #84cc16; white-space: nowrap; }
        .carousel--87 .carousel__tab.active { border-bottom: 2px solid #65a30d; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--87 .carousel__tab.active .carousel__tab-title { color: #4d7c0f; }
        .carousel--87 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--87 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #a3e635; transition: all 0.3s ease; }
        .carousel--87 .carousel__arrow:hover { color: #65a30d; }
        .carousel--87 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--87 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 25px rgba(101,163,13,0.25); }
        .carousel--87 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(0.9); transition: opacity 0.5s ease, transform 0.5s ease; }
        .carousel--87 .carousel__image img.active { opacity: 1; transform: scale(1); }
        .carousel--87 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #65a30d, transparent); align-self: center; }
        .carousel--87 .carousel__content { display: flex; align-items: center; }
        .carousel--87 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--87 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--87 .carousel__number-wrapper::before, .carousel--87 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #84cc16; }
        .carousel--87 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #84cc16; line-height: 1; }
        .carousel--87 .carousel__text-content { position: relative; display: grid; background: #365314; border-radius: 12px; padding: 1.5rem; }
        .carousel--87 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--87 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--87 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--87 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #ecfccb; }
        .carousel--87 .carousel__content p { color: rgba(236,252,203,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--87 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #a3e635; color: #365314; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--87 .carousel__btn:hover { background: #84cc16; }
        .carousel--87 .carousel__btn span, .carousel--87 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--87 .carousel__progress { height: 2px; background: #bef264; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--87 .carousel__progress-bar { height: 100%; background: #65a30d; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V88: CORAL + DOUBLE BORDER IMAGE (Based on V76)
// ============================================
function Carousel88({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--88">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--88 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 15px rgba(251,113,133,0.15); }
        .carousel--88 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--88 .carousel__tabs-wrapper::before, .carousel--88 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--88 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--88 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--88 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #fecdd3; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--88 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--88 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--88 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #fda4af; }
        .carousel--88 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fb7185; white-space: nowrap; }
        .carousel--88 .carousel__tab.active { border-bottom: 2px solid #f43f5e; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--88 .carousel__tab.active .carousel__tab-title { color: #e11d48; }
        .carousel--88 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--88 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #fda4af; transition: all 0.3s ease; }
        .carousel--88 .carousel__arrow:hover { color: #f43f5e; }
        .carousel--88 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--88 .carousel__image { position: relative; border-radius: 12px; padding: 4px; background: linear-gradient(135deg, #f43f5e, #fb7185); box-shadow: 0 8px 25px rgba(244,63,94,0.25); }
        .carousel--88 .carousel__image::before { content: ''; position: absolute; inset: 4px; border-radius: 8px; border: 2px solid #fff; z-index: 2; pointer-events: none; }
        .carousel--88 .carousel__image img { position: absolute; inset: 4px; width: calc(100% - 8px); height: calc(100% - 8px); object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--88 .carousel__image img.active { opacity: 1; }
        .carousel--88 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #f43f5e, transparent); align-self: center; }
        .carousel--88 .carousel__content { display: flex; align-items: center; }
        .carousel--88 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--88 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--88 .carousel__number-wrapper::before, .carousel--88 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #f43f5e; }
        .carousel--88 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #f43f5e; line-height: 1; }
        .carousel--88 .carousel__text-content { position: relative; display: grid; background: #fff1f2; border-radius: 12px; padding: 1.5rem; }
        .carousel--88 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--88 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--88 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--88 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #be123c; }
        .carousel--88 .carousel__content p { color: #9f1239; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--88 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #f43f5e; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border-radius: 6px; }
        .carousel--88 .carousel__btn:hover { background: #e11d48; }
        .carousel--88 .carousel__btn span, .carousel--88 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--88 .carousel__progress { height: 2px; background: #fecdd3; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--88 .carousel__progress-bar { height: 100%; background: #f43f5e; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V89: INDIGO DEEP + CLIP PATH REVEAL (Based on V77)
// ============================================
function Carousel89({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--89">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--89 { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(99,102,241,0.15); }
        .carousel--89 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--89 .carousel__tabs-wrapper::before, .carousel--89 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--89 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #eef2ff, transparent); }
        .carousel--89 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #e0e7ff, transparent); }
        .carousel--89 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #c7d2fe; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--89 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--89 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--89 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #a5b4fc; }
        .carousel--89 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #818cf8; white-space: nowrap; }
        .carousel--89 .carousel__tab.active { border-bottom: 2px solid #6366f1; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--89 .carousel__tab.active .carousel__tab-title { color: #4f46e5; }
        .carousel--89 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--89 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #a5b4fc; transition: all 0.3s ease; }
        .carousel--89 .carousel__arrow:hover { color: #6366f1; }
        .carousel--89 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--89 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(99,102,241,0.25); }
        .carousel--89 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; clip-path: inset(0 100% 0 0); transition: opacity 0.5s ease, clip-path 0.5s ease; }
        .carousel--89 .carousel__image img.active { opacity: 1; clip-path: inset(0 0 0 0); }
        .carousel--89 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #6366f1, transparent); align-self: center; }
        .carousel--89 .carousel__content { display: flex; align-items: center; }
        .carousel--89 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--89 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--89 .carousel__number-wrapper::before, .carousel--89 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #818cf8; }
        .carousel--89 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #818cf8; line-height: 1; }
        .carousel--89 .carousel__text-content { position: relative; display: grid; background: #312e81; border-radius: 12px; padding: 1.5rem; }
        .carousel--89 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--89 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--89 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--89 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--89 .carousel__content p { color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--89 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #a5b4fc; color: #312e81; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--89 .carousel__btn:hover { background: #818cf8; }
        .carousel--89 .carousel__btn span, .carousel--89 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--89 .carousel__progress { height: 2px; background: #c7d2fe; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--89 .carousel__progress-bar { height: 100%; background: #6366f1; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V90: TEAL + LAYERED SHADOW (Based on V76)
// ============================================
function Carousel90({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--90">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--90 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 1px 3px rgba(20,184,166,0.1), 0 4px 6px rgba(20,184,166,0.1), 0 10px 20px rgba(20,184,166,0.1); }
        .carousel--90 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--90 .carousel__tabs-wrapper::before, .carousel--90 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--90 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--90 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--90 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #99f6e4; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--90 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--90 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--90 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #5eead4; }
        .carousel--90 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #2dd4bf; white-space: nowrap; }
        .carousel--90 .carousel__tab.active { border-bottom: 2px solid #14b8a6; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--90 .carousel__tab.active .carousel__tab-title { color: #0d9488; }
        .carousel--90 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--90 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #5eead4; transition: all 0.3s ease; }
        .carousel--90 .carousel__arrow:hover { color: #14b8a6; }
        .carousel--90 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--90 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 4px 4px 0 #99f6e4, 8px 8px 0 #5eead4, 12px 12px 0 #2dd4bf; }
        .carousel--90 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--90 .carousel__image img.active { opacity: 1; }
        .carousel--90 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #14b8a6, transparent); align-self: center; }
        .carousel--90 .carousel__content { display: flex; align-items: center; }
        .carousel--90 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--90 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--90 .carousel__number-wrapper::before, .carousel--90 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #14b8a6; }
        .carousel--90 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #14b8a6; line-height: 1; }
        .carousel--90 .carousel__text-content { position: relative; display: grid; background: #f0fdfa; border-radius: 12px; padding: 1.5rem; box-shadow: 4px 4px 0 #ccfbf1; }
        .carousel--90 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--90 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--90 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--90 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #134e4a; }
        .carousel--90 .carousel__content p { color: #0f766e; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--90 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #14b8a6; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--90 .carousel__btn:hover { background: #0d9488; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 #5eead4; }
        .carousel--90 .carousel__btn span, .carousel--90 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--90 .carousel__progress { height: 2px; background: #99f6e4; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--90 .carousel__progress-bar { height: 100%; background: #14b8a6; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V91: DARK BLUE + NEON GLOW (Based on V77)
// ============================================
function Carousel91({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--91">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--91 { max-width: 1000px; margin: 0 auto; background: #0f172a; padding: 2rem; border-radius: 16px; box-shadow: 0 0 30px rgba(56,189,248,0.2); }
        .carousel--91 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--91 .carousel__tabs-wrapper::before, .carousel--91 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--91 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #0f172a, transparent); }
        .carousel--91 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #0f172a, transparent); }
        .carousel--91 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #1e3a5f; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--91 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--91 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--91 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #0ea5e9; }
        .carousel--91 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8; white-space: nowrap; }
        .carousel--91 .carousel__tab.active { border-bottom: 2px solid #38bdf8; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); box-shadow: 0 2px 10px rgba(56,189,248,0.5); }
        .carousel--91 .carousel__tab.active .carousel__tab-title { color: #7dd3fc; text-shadow: 0 0 10px rgba(56,189,248,0.8); }
        .carousel--91 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--91 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #0ea5e9; transition: all 0.3s ease; }
        .carousel--91 .carousel__arrow:hover { color: #38bdf8; text-shadow: 0 0 15px rgba(56,189,248,0.8); }
        .carousel--91 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--91 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 0 30px rgba(56,189,248,0.4), inset 0 0 20px rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); }
        .carousel--91 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--91 .carousel__image img.active { opacity: 1; }
        .carousel--91 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #38bdf8, transparent); align-self: center; box-shadow: 0 0 10px rgba(56,189,248,0.5); }
        .carousel--91 .carousel__content { display: flex; align-items: center; }
        .carousel--91 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--91 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--91 .carousel__number-wrapper::before, .carousel--91 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #0ea5e9; box-shadow: 0 0 5px rgba(56,189,248,0.5); }
        .carousel--91 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #38bdf8; line-height: 1; text-shadow: 0 0 20px rgba(56,189,248,0.6); }
        .carousel--91 .carousel__text-content { position: relative; display: grid; background: #1e293b; border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(56,189,248,0.2); }
        .carousel--91 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--91 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--91 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--91 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #f0f9ff; }
        .carousel--91 .carousel__content p { color: #7dd3fc; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--91 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: transparent; color: #38bdf8; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border: 1px solid #38bdf8; }
        .carousel--91 .carousel__btn:hover { background: #38bdf8; color: #0f172a; box-shadow: 0 0 20px rgba(56,189,248,0.5); }
        .carousel--91 .carousel__btn span, .carousel--91 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--91 .carousel__progress { height: 2px; background: #1e3a5f; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--91 .carousel__progress-bar { height: 100%; background: #38bdf8; transition: width 0.4s ease; box-shadow: 0 0 10px rgba(56,189,248,0.8); }
      `}</style>
    </div>
  );
}

// ============================================
// V92: CREAM + SEPIA IMAGE FILTER (Based on V76)
// ============================================
function Carousel92({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--92">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--92 { max-width: 1000px; margin: 0 auto; background: #fefce8; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(161,98,7,0.1); }
        .carousel--92 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--92 .carousel__tabs-wrapper::before, .carousel--92 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--92 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fefce8, transparent); }
        .carousel--92 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fefce8, transparent); }
        .carousel--92 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #fde047; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--92 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--92 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--92 .carousel__tab-num { font-family: 'Georgia', serif; font-size: 0.85rem; font-weight: 600; color: #ca8a04; }
        .carousel--92 .carousel__tab-title { font-family: 'Georgia', serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a16207; white-space: nowrap; }
        .carousel--92 .carousel__tab.active { border-bottom: 2px solid #854d0e; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--92 .carousel__tab.active .carousel__tab-title { color: #713f12; }
        .carousel--92 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--92 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #ca8a04; transition: all 0.3s ease; }
        .carousel--92 .carousel__arrow:hover { color: #854d0e; }
        .carousel--92 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--92 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 25px rgba(161,98,7,0.2); }
        .carousel--92 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: sepia(30%) saturate(90%); transition: opacity 0.5s ease, filter 0.5s ease; }
        .carousel--92 .carousel__image img.active { opacity: 1; filter: sepia(0%) saturate(100%); }
        .carousel--92 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #854d0e, transparent); align-self: center; }
        .carousel--92 .carousel__content { display: flex; align-items: center; }
        .carousel--92 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--92 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--92 .carousel__number-wrapper::before, .carousel--92 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ca8a04; }
        .carousel--92 .carousel__inline-number { font-family: 'Georgia', serif; font-size: 2.5rem; font-weight: 700; color: #a16207; line-height: 1; }
        .carousel--92 .carousel__text-content { position: relative; display: grid; background: #fffbeb; border-radius: 12px; padding: 1.5rem; border: 1px solid #fde047; }
        .carousel--92 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--92 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--92 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--92 .carousel__content h3 { font-family: 'Georgia', serif; font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #713f12; }
        .carousel--92 .carousel__content p { font-family: 'Georgia', serif; color: #854d0e; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--92 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #854d0e; color: #fefce8; text-decoration: none; font-family: 'Georgia', serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--92 .carousel__btn:hover { background: #713f12; }
        .carousel--92 .carousel__btn span, .carousel--92 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--92 .carousel__progress { height: 2px; background: #fde047; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--92 .carousel__progress-bar { height: 100%; background: #854d0e; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V93: FUCHSIA + GRAYSCALE TO COLOR (Based on V77)
// ============================================
function Carousel93({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--93">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--93 { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(217,70,239,0.15); }
        .carousel--93 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--93 .carousel__tabs-wrapper::before, .carousel--93 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--93 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fdf4ff, transparent); }
        .carousel--93 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fae8ff, transparent); }
        .carousel--93 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #f5d0fe; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--93 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--93 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--93 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #e879f9; }
        .carousel--93 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #d946ef; white-space: nowrap; }
        .carousel--93 .carousel__tab.active { border-bottom: 2px solid #c026d3; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--93 .carousel__tab.active .carousel__tab-title { color: #a21caf; }
        .carousel--93 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--93 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #e879f9; transition: all 0.3s ease; }
        .carousel--93 .carousel__arrow:hover { color: #c026d3; }
        .carousel--93 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--93 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 25px rgba(192,38,211,0.25); }
        .carousel--93 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: grayscale(100%); transition: opacity 0.5s ease, filter 0.5s ease; }
        .carousel--93 .carousel__image img.active { opacity: 1; filter: grayscale(0%); }
        .carousel--93 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #c026d3, transparent); align-self: center; }
        .carousel--93 .carousel__content { display: flex; align-items: center; }
        .carousel--93 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--93 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--93 .carousel__number-wrapper::before, .carousel--93 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #d946ef; }
        .carousel--93 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #d946ef; line-height: 1; }
        .carousel--93 .carousel__text-content { position: relative; display: grid; background: #701a75; border-radius: 12px; padding: 1.5rem; }
        .carousel--93 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--93 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--93 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--93 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fdf4ff; }
        .carousel--93 .carousel__content p { color: rgba(253,244,255,0.75); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--93 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #f5d0fe; color: #701a75; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--93 .carousel__btn:hover { background: #e879f9; }
        .carousel--93 .carousel__btn span, .carousel--93 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--93 .carousel__progress { height: 2px; background: #f5d0fe; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--93 .carousel__progress-bar { height: 100%; background: #c026d3; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V94: STONE + ROUNDED CORNERS (Based on V76)
// ============================================
function Carousel94({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--94">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--94 { max-width: 1000px; margin: 0 auto; background: #fafaf9; padding: 2rem; border-radius: 24px; box-shadow: 0 4px 20px rgba(120,113,108,0.1); }
        .carousel--94 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--94 .carousel__tabs-wrapper::before, .carousel--94 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--94 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fafaf9, transparent); }
        .carousel--94 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fafaf9, transparent); }
        .carousel--94 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e7e5e4; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--94 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--94 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: none; border: none; cursor: pointer; border-radius: 20px; transition: background 0.3s ease; }
        .carousel--94 .carousel__tab:hover { background: #f5f5f4; }
        .carousel--94 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #a8a29e; }
        .carousel--94 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; white-space: nowrap; }
        .carousel--94 .carousel__tab.active { background: #57534e; border-bottom: none; margin-bottom: 0; padding-bottom: 0.5rem; }
        .carousel--94 .carousel__tab.active .carousel__tab-num { color: #d6d3d1; }
        .carousel--94 .carousel__tab.active .carousel__tab-title { color: #fff; }
        .carousel--94 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--94 .carousel__arrow { padding: 0.75rem; border: none; background: #f5f5f4; cursor: pointer; color: #78716c; transition: all 0.3s ease; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
        .carousel--94 .carousel__arrow:hover { background: #57534e; color: #fff; }
        .carousel--94 .carousel__arrow svg { width: 24px; }
        .carousel--94 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--94 .carousel__image { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 25px rgba(87,83,78,0.15); }
        .carousel--94 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 20px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--94 .carousel__image img.active { opacity: 1; }
        .carousel--94 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #a8a29e, transparent); align-self: center; }
        .carousel--94 .carousel__content { display: flex; align-items: center; }
        .carousel--94 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--94 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--94 .carousel__number-wrapper::before, .carousel--94 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #a8a29e; }
        .carousel--94 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #78716c; line-height: 1; }
        .carousel--94 .carousel__text-content { position: relative; display: grid; background: #f5f5f4; border-radius: 20px; padding: 1.5rem; }
        .carousel--94 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--94 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--94 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--94 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #292524; }
        .carousel--94 .carousel__content p { color: #57534e; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--94 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #57534e; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border-radius: 25px; }
        .carousel--94 .carousel__btn:hover { background: #44403c; }
        .carousel--94 .carousel__btn span, .carousel--94 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--94 .carousel__progress { height: 4px; background: #e7e5e4; margin-top: 2rem; border-radius: 2px; overflow: hidden; }
        .carousel--94 .carousel__progress-bar { height: 100%; background: #57534e; transition: width 0.4s ease; border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ============================================
// V95: MIDNIGHT + GRADIENT PROGRESS (Based on V77)
// ============================================
function Carousel95({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--95">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--95 { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(30,27,75,0.5); }
        .carousel--95 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--95 .carousel__tabs-wrapper::before, .carousel--95 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--95 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #1e1b4b, transparent); }
        .carousel--95 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #312e81, transparent); }
        .carousel--95 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--95 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--95 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--95 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.4); }
        .carousel--95 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); white-space: nowrap; }
        .carousel--95 .carousel__tab.active { border-bottom: 2px solid #a78bfa; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--95 .carousel__tab.active .carousel__tab-title { color: #c4b5fd; }
        .carousel--95 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--95 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: rgba(255,255,255,0.4); transition: all 0.3s ease; }
        .carousel--95 .carousel__arrow:hover { color: #a78bfa; }
        .carousel--95 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--95 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
        .carousel--95 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--95 .carousel__image img.active { opacity: 1; }
        .carousel--95 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #a78bfa, transparent); align-self: center; }
        .carousel--95 .carousel__content { display: flex; align-items: center; }
        .carousel--95 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--95 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--95 .carousel__number-wrapper::before, .carousel--95 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #a78bfa; }
        .carousel--95 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #a78bfa; line-height: 1; }
        .carousel--95 .carousel__text-content { position: relative; display: grid; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .carousel--95 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--95 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--95 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--95 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #fff; }
        .carousel--95 .carousel__content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--95 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: linear-gradient(90deg, #a78bfa, #818cf8); color: #1e1b4b; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--95 .carousel__btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(167,139,250,0.4); }
        .carousel--95 .carousel__btn span, .carousel--95 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--95 .carousel__progress { height: 3px; background: rgba(255,255,255,0.1); margin-top: 2rem; border-radius: 2px; overflow: hidden; }
        .carousel--95 .carousel__progress-bar { height: 100%; background: linear-gradient(90deg, #a78bfa, #818cf8, #c4b5fd); transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V96: ORANGE VIBRANT + LIFT SHADOW (Based on V76)
// ============================================
function Carousel96({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--96">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--96 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px rgba(251,146,60,0.1), 0 10px 15px rgba(251,146,60,0.1), 0 20px 25px rgba(251,146,60,0.1); transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .carousel--96:hover { transform: translateY(-4px); box-shadow: 0 6px 8px rgba(251,146,60,0.15), 0 15px 20px rgba(251,146,60,0.15), 0 30px 35px rgba(251,146,60,0.15); }
        .carousel--96 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--96 .carousel__tabs-wrapper::before, .carousel--96 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--96 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--96 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--96 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #fed7aa; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--96 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--96 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--96 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #fdba74; }
        .carousel--96 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fb923c; white-space: nowrap; }
        .carousel--96 .carousel__tab.active { border-bottom: 2px solid #f97316; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--96 .carousel__tab.active .carousel__tab-title { color: #ea580c; }
        .carousel--96 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--96 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #fdba74; transition: all 0.3s ease; }
        .carousel--96 .carousel__arrow:hover { color: #f97316; }
        .carousel--96 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--96 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(249,115,22,0.25); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .carousel--96 .carousel__image:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(249,115,22,0.3); }
        .carousel--96 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--96 .carousel__image img.active { opacity: 1; }
        .carousel--96 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #f97316, transparent); align-self: center; }
        .carousel--96 .carousel__content { display: flex; align-items: center; }
        .carousel--96 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--96 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--96 .carousel__number-wrapper::before, .carousel--96 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #f97316; }
        .carousel--96 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #f97316; line-height: 1; }
        .carousel--96 .carousel__text-content { position: relative; display: grid; background: #fff7ed; border-radius: 12px; padding: 1.5rem; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .carousel--96 .carousel__text-content:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(249,115,22,0.15); }
        .carousel--96 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--96 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--96 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--96 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #9a3412; }
        .carousel--96 .carousel__content p { color: #c2410c; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--96 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #f97316; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; }
        .carousel--96 .carousel__btn:hover { background: #ea580c; }
        .carousel--96 .carousel__btn span, .carousel--96 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--96 .carousel__progress { height: 2px; background: #fed7aa; margin-top: 2rem; border-radius: 1px; overflow: hidden; }
        .carousel--96 .carousel__progress-bar { height: 100%; background: #f97316; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V97: MINIMAL WHITE + OUTLINE ONLY (Based on V77)
// ============================================
function Carousel97({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--97">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <style>{`
        .carousel--97 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; border: 1px solid #e5e7eb; }
        .carousel--97 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--97 .carousel__tabs-wrapper::before, .carousel--97 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--97 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--97 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--97 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--97 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--97 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--97 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #d1d5db; }
        .carousel--97 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; white-space: nowrap; }
        .carousel--97 .carousel__tab.active { border-bottom: 1px solid #111827; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 1px); }
        .carousel--97 .carousel__tab.active .carousel__tab-title { color: #111827; }
        .carousel--97 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--97 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #d1d5db; transition: all 0.3s ease; }
        .carousel--97 .carousel__arrow:hover { color: #111827; }
        .carousel--97 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--97 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
        .carousel--97 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--97 .carousel__image img.active { opacity: 1; }
        .carousel--97 .carousel__divider { width: 1px; height: 120px; background: #e5e7eb; align-self: center; }
        .carousel--97 .carousel__content { display: flex; align-items: center; }
        .carousel--97 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--97 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--97 .carousel__number-wrapper::before, .carousel--97 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #e5e7eb; }
        .carousel--97 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 300; color: #d1d5db; line-height: 1; }
        .carousel--97 .carousel__text-content { position: relative; display: grid; background: transparent; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e7eb; }
        .carousel--97 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--97 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--97 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--97 .carousel__content h3 { font-size: 1.25rem; font-weight: 500; margin: 0; text-transform: uppercase; text-align: center; color: #111827; letter-spacing: 0.1em; }
        .carousel--97 .carousel__content p { color: #6b7280; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--97 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: transparent; color: #111827; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border: 1px solid #111827; }
        .carousel--97 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #111827; transition: width 0.4s ease; z-index: 0; }
        .carousel--97 .carousel__btn:hover::before { width: 100%; }
        .carousel--97 .carousel__btn:hover { color: #fff; }
        .carousel--97 .carousel__btn span, .carousel--97 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--97 .carousel__progress { height: 1px; background: #e5e7eb; margin-top: 2rem; overflow: hidden; }
        .carousel--97 .carousel__progress-bar { height: 100%; background: #111827; transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}

// ============================================
// V56: IMAGE ON RIGHT (Based on V54)
// ============================================
function Carousel56({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--56">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--56 { max-width: 1000px; margin: 0 auto; }
        .carousel--56 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--56 .carousel__tabs-wrapper::before, .carousel--56 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--56 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .carousel--56 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .carousel--56 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--56 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--56 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--56 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--56 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--56 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--56 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--56 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--56 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--56 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--56 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--56 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--56 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--56 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; }
        .carousel--56 .carousel__image::after { content: ''; position: absolute; bottom: -20px; left: 5%; width: 90%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%); z-index: -1; filter: blur(3px); }
        .carousel--56 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--56 .carousel__image img.active { opacity: 1; }
        .carousel--56 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--56 .carousel__content { display: flex; align-items: center; }
        .carousel--56 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--56 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--56 .carousel__number-wrapper::before, .carousel--56 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ccc; }
        .carousel--56 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #999; line-height: 1; }
        .carousel--56 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--56 .carousel__text-content::after { content: ''; position: absolute; bottom: -20px; left: 5%; width: 90%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%); z-index: -1; filter: blur(3px); }
        .carousel--56 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--56 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--56 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--56 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; }
        .carousel--56 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--56 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--56 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--56 .carousel__btn:hover::before { width: 100%; }
        .carousel--56 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--56 .carousel__btn span, .carousel--56 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--56 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V57: ACCENT COLOR BLUE (Based on V54)
// ============================================
function Carousel57({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--57">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--57 { max-width: 1000px; margin: 0 auto; }
        .carousel--57 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--57 .carousel__tabs-wrapper::before, .carousel--57 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--57 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .carousel--57 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .carousel--57 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--57 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--57 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--57 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--57 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--57 .carousel__tab.active { border-bottom: 2px solid #2563eb; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--57 .carousel__tab.active .carousel__tab-title { color: #2563eb; }
        .carousel--57 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--57 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--57 .carousel__arrow:hover { color: #2563eb; }
        .carousel--57 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--57 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--57 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--57 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; z-index: 2; border: 3px solid #2563eb; }
        .carousel--57 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 5px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--57 .carousel__image img.active { opacity: 1; }
        .carousel--57 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #2563eb, transparent); align-self: center; }
        .carousel--57 .carousel__content { display: flex; align-items: center; }
        .carousel--57 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--57 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--57 .carousel__number-wrapper::before, .carousel--57 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #2563eb; }
        .carousel--57 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #2563eb; line-height: 1; }
        .carousel--57 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(37,99,235,0.15); }
        .carousel--57 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--57 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--57 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--57 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; }
        .carousel--57 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--57 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #2563eb; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border-radius: 4px; }
        .carousel--57 .carousel__btn:hover { background: #1d4ed8; }
        .carousel--57 .carousel__btn span, .carousel--57 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--57 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V58: MINIMAL NO DIVIDER (Based on V54)
// ============================================
function Carousel58({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--58">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row">
                    <div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div>
                    <h3>{slide.title}</h3>
                  </div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--58 { max-width: 1000px; margin: 0 auto; }
        .carousel--58 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--58 .carousel__tabs-wrapper::before, .carousel--58 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--58 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .carousel--58 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .carousel--58 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--58 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--58 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--58 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--58 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--58 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--58 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--58 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--58 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--58 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--58 .carousel__arrow svg { transition: transform 0.3s ease; }
        .carousel--58 .carousel__arrow:hover svg { transform: scaleX(1.3); }
        .carousel--58 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: stretch; }
        .carousel--58 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--58 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--58 .carousel__image img.active { opacity: 1; }
        .carousel--58 .carousel__content { display: flex; align-items: center; }
        .carousel--58 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--58 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--58 .carousel__number-wrapper::before, .carousel--58 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ccc; }
        .carousel--58 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #999; line-height: 1; }
        .carousel--58 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--58 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--58 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--58 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--58 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; }
        .carousel--58 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--58 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--58 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--58 .carousel__btn:hover::before { width: 100%; }
        .carousel--58 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--58 .carousel__btn span, .carousel--58 .carousel__btn-chevron { position: relative; z-index: 1; }
      `}</style>
    </div>
  );
}

// ============================================
// V59: LARGE NUMBER OVERLAY ON IMAGE (Based on V54)
// ============================================
function Carousel59({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--59">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">
            {slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}
            <div className="carousel__image-number">{String(activeSlide + 1).padStart(2, '0')}</div>
          </div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--59 { max-width: 1000px; margin: 0 auto; }
        .carousel--59 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--59 .carousel__tabs-wrapper::before, .carousel--59 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--59 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .carousel--59 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .carousel--59 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--59 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--59 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--59 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--59 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--59 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--59 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--59 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--59 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--59 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--59 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--59 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--59 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--59 .carousel__image img.active { opacity: 1; }
        .carousel--59 .carousel__image-number { position: absolute; bottom: 1rem; right: 1rem; font-family: 'Share Tech Mono', monospace; font-size: 6rem; font-weight: 900; color: rgba(255,255,255,0.3); line-height: 1; z-index: 10; }
        .carousel--59 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--59 .carousel__content { display: flex; align-items: center; }
        .carousel--59 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--59 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--59 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--59 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--59 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; text-align: center; }
        .carousel--59 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 0 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--59 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: color 0.4s ease; }
        .carousel--59 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #fff; transition: width 0.4s ease; z-index: 0; }
        .carousel--59 .carousel__btn:hover::before { width: 100%; }
        .carousel--59 .carousel__btn:hover { color: #1a1a1a; }
        .carousel--59 .carousel__btn span, .carousel--59 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--59 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V60: ROUNDED CARD + CIRCLE ARROWS (Based on V54)
// ============================================
function Carousel60({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--60">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="20" height="20" viewBox="0 0 20 20"><polyline points="12 5 7 10 12 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row"><div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div><h3>{slide.title}</h3></div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="20" height="20" viewBox="0 0 20 20"><polyline points="8 5 13 10 8 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--60 { max-width: 1000px; margin: 0 auto; }
        .carousel--60 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--60 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--60 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--60 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--60 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--60 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--60 .carousel__tab.active { border-bottom: 2px solid #1a1a1a; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--60 .carousel__tab.active .carousel__tab-title { color: #1a1a1a; }
        .carousel--60 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--60 .carousel__arrow { width: 48px; height: 48px; border-radius: 50%; border: 2px solid #ddd; background: #fff; cursor: pointer; color: #999; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .carousel--60 .carousel__arrow:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .carousel--60 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--60 .carousel__image { position: relative; border-radius: 24px; overflow: hidden; }
        .carousel--60 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 24px; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--60 .carousel__image img.active { opacity: 1; }
        .carousel--60 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--60 .carousel__content { display: flex; align-items: center; }
        .carousel--60 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--60 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--60 .carousel__number-wrapper::before, .carousel--60 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #ccc; }
        .carousel--60 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #999; line-height: 1; }
        .carousel--60 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .carousel--60 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--60 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--60 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--60 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; }
        .carousel--60 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--60 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 24px; transition: background 0.3s; }
        .carousel--60 .carousel__btn:hover { background: #333; }
        .carousel--60 .carousel__bottom-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// V61: VERTICAL LAYOUT (Based on V54)
// ============================================
function Carousel61({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--61">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{String(idx + 1).padStart(2, '0')}</button>))}</div>
      <div className="carousel__main">
        <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        <div className="carousel__nav">
          <button className="carousel__arrow" onClick={prevSlide}><svg width="20" height="20" viewBox="0 0 20 20"><polyline points="15 12 10 7 5 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <span className="carousel__counter">{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <button className="carousel__arrow" onClick={nextSlide}><svg width="20" height="20" viewBox="0 0 20 20"><polyline points="5 8 10 13 15 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>
        <div className="carousel__text-content">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .carousel--61 { max-width: 500px; margin: 0 auto; }
        .carousel--61 .carousel__tabs { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .carousel--61 .carousel__tab { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #ddd; background: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; }
        .carousel--61 .carousel__tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .carousel--61 .carousel__main { display: flex; flex-direction: column; gap: 1.5rem; }
        .carousel--61 .carousel__image { position: relative; aspect-ratio: 16/10; border-radius: 12px; overflow: hidden; }
        .carousel--61 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--61 .carousel__image img.active { opacity: 1; }
        .carousel--61 .carousel__nav { display: flex; align-items: center; justify-content: center; gap: 2rem; }
        .carousel--61 .carousel__arrow { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer; color: #666; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .carousel--61 .carousel__arrow:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .carousel--61 .carousel__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #999; }
        .carousel--61 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
        .carousel--61 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--61 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--61 .carousel__slide-content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--61 .carousel__slide-content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--61 .carousel__btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 auto; }
      `}</style>
    </div>
  );
}

// ============================================
// V62: PILL TABS (Based on V54)
// ============================================
function Carousel62({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--62">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__number">{String(idx + 1).padStart(2, '0')}</div>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--62 { max-width: 1000px; margin: 0 auto; }
        .carousel--62 .carousel__tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }
        .carousel--62 .carousel__tab { padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid #ddd; background: #fff; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.3s; color: #666; }
        .carousel--62 .carousel__tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .carousel--62 .carousel__tab:hover:not(.active) { border-color: #999; }
        .carousel--62 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--62 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--62 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--62 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--62 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--62 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--62 .carousel__image img.active { opacity: 1; }
        .carousel--62 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--62 .carousel__content { display: flex; align-items: center; }
        .carousel--62 .carousel__number { font-family: 'Share Tech Mono', monospace; font-size: 3rem; font-weight: 700; color: #eee; text-align: center; margin-bottom: 0.5rem; }
        .carousel--62 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--62 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--62 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--62 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--62 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; text-transform: uppercase; text-align: center; }
        .carousel--62 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--62 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}

// ============================================
// V63: GRADIENT ACCENT (Based on V54)
// ============================================
function Carousel63({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--63">
      <div className="carousel__tabs-wrapper">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      </div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row"><div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div><h3>{slide.title}</h3></div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="carousel__bottom-divider"></div>
      <style>{`
        .carousel--63 { max-width: 1000px; margin: 0 auto; }
        .carousel--63 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--63 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 2px solid transparent; border-image: linear-gradient(to right, #f472b6, #8b5cf6, #3b82f6) 1; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--63 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--63 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--63 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #bbb; }
        .carousel--63 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #999; white-space: nowrap; }
        .carousel--63 .carousel__tab.active .carousel__tab-title { background: linear-gradient(to right, #f472b6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .carousel--63 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--63 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--63 .carousel__arrow:hover { color: #8b5cf6; }
        .carousel--63 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--63 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; padding: 3px; background: linear-gradient(135deg, #f472b6, #8b5cf6, #3b82f6); }
        .carousel--63 .carousel__image img { position: absolute; inset: 3px; width: calc(100% - 6px); height: calc(100% - 6px); object-fit: cover; border-radius: 5px; opacity: 0; transition: opacity 0.5s; }
        .carousel--63 .carousel__image img.active { opacity: 1; }
        .carousel--63 .carousel__divider { width: 2px; height: 120px; background: linear-gradient(to bottom, #f472b6, #8b5cf6, #3b82f6); align-self: center; border-radius: 1px; }
        .carousel--63 .carousel__content { display: flex; align-items: center; }
        .carousel--63 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--63 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--63 .carousel__number-wrapper::before, .carousel--63 .carousel__number-wrapper::after { content: ''; width: 30px; height: 2px; background: linear-gradient(to right, #f472b6, #8b5cf6); border-radius: 1px; }
        .carousel--63 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; background: linear-gradient(to right, #f472b6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
        .carousel--63 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(139,92,246,0.15); }
        .carousel--63 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--63 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--63 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--63 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; }
        .carousel--63 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--63 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: linear-gradient(to right, #f472b6, #8b5cf6); color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; transition: opacity 0.3s; }
        .carousel--63 .carousel__btn:hover { opacity: 0.9; }
        .carousel--63 .carousel__bottom-divider { width: 100%; height: 2px; background: linear-gradient(to right, transparent, #f472b6, #8b5cf6, #3b82f6, transparent); margin-top: 2rem; border-radius: 1px; }
      `}</style>
    </div>
  );
}

// ============================================
// V64: BOXED NUMBERS (Based on V54)
// ============================================
function Carousel64({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--64">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__box-number">{String(idx + 1).padStart(2, '0')}</div>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--64 { max-width: 1000px; margin: 0 auto; }
        .carousel--64 .carousel__tabs { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; }
        .carousel--64 .carousel__tab { width: 50px; height: 50px; border: 2px solid #e0e0e0; background: #fff; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .carousel--64 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 1rem; font-weight: 700; color: #999; }
        .carousel--64 .carousel__tab.active { background: #1a1a1a; border-color: #1a1a1a; }
        .carousel--64 .carousel__tab.active .carousel__tab-num { color: #fff; }
        .carousel--64 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--64 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: all 0.3s ease; }
        .carousel--64 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--64 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--64 .carousel__image { position: relative; border-radius: 0; overflow: hidden; }
        .carousel--64 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--64 .carousel__image img.active { opacity: 1; }
        .carousel--64 .carousel__divider { width: 1px; height: 120px; background: #ddd; align-self: center; }
        .carousel--64 .carousel__content { display: flex; align-items: center; }
        .carousel--64 .carousel__box-number { width: 60px; height: 60px; background: #1a1a1a; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .carousel--64 .carousel__text-content { position: relative; display: grid; background: #fff; padding: 1.5rem; border: 1px solid #e0e0e0; }
        .carousel--64 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--64 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--64 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--64 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; text-align: center; }
        .carousel--64 .carousel__content p { color: #666; line-height: 1.7; margin: 0; padding: 0 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--64 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}

// ============================================
// V65: SIDE NUMBER BAR (Based on V54)
// ============================================
function Carousel65({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--65">
      <div className="carousel__number-bar"><span>{String(activeSlide + 1).padStart(2, '0')}</span></div>
      <div className="carousel__main-area">
        <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>))}</div>
        <div className="carousel__body">
          <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <div className="carousel__main">
            <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
            <div className="carousel__content">
              <div className="carousel__text-content">
                {slides.map((slide, idx) => (
                  <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                    <h3>{slide.title}</h3><p>{slide.description}</p>
                    <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>
      </div>
      <style>{`
        .carousel--65 { max-width: 1100px; margin: 0 auto; display: flex; gap: 2rem; }
        .carousel--65 .carousel__number-bar { width: 80px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .carousel--65 .carousel__number-bar span { font-family: 'Share Tech Mono', monospace; font-size: 3rem; font-weight: 700; color: #fff; writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
        .carousel--65 .carousel__main-area { flex: 1; }
        .carousel--65 .carousel__tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .carousel--65 .carousel__tab { padding: 0.5rem 1rem; background: none; border: none; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #999; cursor: pointer; border-bottom: 2px solid transparent; }
        .carousel--65 .carousel__tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
        .carousel--65 .carousel__body { display: flex; align-items: center; gap: 1rem; }
        .carousel--65 .carousel__arrow { padding: 0.5rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--65 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--65 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: stretch; }
        .carousel--65 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--65 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--65 .carousel__image img.active { opacity: 1; }
        .carousel--65 .carousel__content { display: flex; align-items: center; }
        .carousel--65 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--65 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--65 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--65 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--65 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; }
        .carousel--65 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--65 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}

// ============================================
// V66: PROGRESS BAR (Based on V54)
// ============================================
function Carousel66({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  const progress = ((activeSlide + 1) / slides.length) * 100;
  return (
    <div className="carousel carousel--66">
      <div className="carousel__progress"><div className="carousel__progress-bar" style={{ width: `${progress}%` }}></div></div>
      <div className="carousel__header"><span className="carousel__counter">{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><h2>{slides[activeSlide].title}</h2></div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--66 { max-width: 1000px; margin: 0 auto; }
        .carousel--66 .carousel__progress { height: 3px; background: #e0e0e0; margin-bottom: 2rem; border-radius: 2px; overflow: hidden; }
        .carousel--66 .carousel__progress-bar { height: 100%; background: #1a1a1a; transition: width 0.5s ease; }
        .carousel--66 .carousel__header { text-align: center; margin-bottom: 2rem; }
        .carousel--66 .carousel__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #999; display: block; margin-bottom: 0.5rem; }
        .carousel--66 .carousel__header h2 { font-size: 1.75rem; font-weight: 700; text-transform: uppercase; margin: 0; }
        .carousel--66 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--66 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #bbb; transition: color 0.3s; }
        .carousel--66 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--66 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--66 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--66 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--66 .carousel__image img.active { opacity: 1; }
        .carousel--66 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #ddd, transparent); align-self: center; }
        .carousel--66 .carousel__content { display: flex; align-items: center; }
        .carousel--66 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--66 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--66 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--66 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--66 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; text-align: center; }
        .carousel--66 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}

// ============================================
// V67: OUTLINE STYLE (Based on V54)
// ============================================
function Carousel67({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--67">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span>{String(idx + 1).padStart(2, '0')}</span> {slide.title}</button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__number">{String(idx + 1).padStart(2, '0')}</div>
                  <h3>{slide.title}</h3><p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--67 { max-width: 1000px; margin: 0 auto; }
        .carousel--67 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--67 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--67 .carousel__tab { padding: 0.5rem 1rem; border: 2px solid #ddd; background: transparent; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.3s; color: #999; white-space: nowrap; }
        .carousel--67 .carousel__tab span { font-family: 'Share Tech Mono', monospace; margin-right: 0.5rem; }
        .carousel--67 .carousel__tab.active { border-color: #1a1a1a; color: #1a1a1a; }
        .carousel--67 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--67 .carousel__arrow { padding: 0.75rem 1rem; border: 2px solid #ddd; background: transparent; cursor: pointer; color: #999; transition: all 0.3s; }
        .carousel--67 .carousel__arrow:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .carousel--67 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: stretch; }
        .carousel--67 .carousel__image { position: relative; border: 2px solid #1a1a1a; }
        .carousel--67 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--67 .carousel__image img.active { opacity: 1; }
        .carousel--67 .carousel__content { display: flex; align-items: center; }
        .carousel--67 .carousel__number { font-family: 'Share Tech Mono', monospace; font-size: 4rem; font-weight: 700; color: transparent; -webkit-text-stroke: 2px #1a1a1a; text-align: center; margin-bottom: 1rem; }
        .carousel--67 .carousel__text-content { position: relative; display: grid; border: 2px solid #1a1a1a; padding: 1.5rem; }
        .carousel--67 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--67 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--67 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--67 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; text-align: center; }
        .carousel--67 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; text-align: center; }
        .carousel--67 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: transparent; border: 2px solid #1a1a1a; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
        .carousel--67 .carousel__btn:hover { background: #1a1a1a; color: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V68: WARM TONES (Based on V54)
// ============================================
function Carousel68({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--68">
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__tab-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__tab-title">{slide.title}</span></button>))}</div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__divider"></div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <div className="carousel__title-row"><div className="carousel__number-wrapper"><span className="carousel__inline-number">{String(idx + 1).padStart(2, '0')}</span></div><h3>{slide.title}</h3></div>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/><polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <style>{`
        .carousel--68 { max-width: 1000px; margin: 0 auto; background: #fef7ed; padding: 2rem; border-radius: 16px; }
        .carousel--68 .carousel__tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid #e8d5c4; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--68 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--68 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--68 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #c9a87c; }
        .carousel--68 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a8896c; white-space: nowrap; }
        .carousel--68 .carousel__tab.active { border-bottom: 2px solid #c2410c; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 2px); }
        .carousel--68 .carousel__tab.active .carousel__tab-title { color: #c2410c; }
        .carousel--68 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--68 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #c9a87c; transition: color 0.3s; }
        .carousel--68 .carousel__arrow:hover { color: #c2410c; }
        .carousel--68 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--68 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--68 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--68 .carousel__image img.active { opacity: 1; }
        .carousel--68 .carousel__divider { width: 1px; height: 120px; background: linear-gradient(to bottom, transparent, #e8d5c4, transparent); align-self: center; }
        .carousel--68 .carousel__content { display: flex; align-items: center; }
        .carousel--68 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--68 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--68 .carousel__number-wrapper::before, .carousel--68 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #c2410c; }
        .carousel--68 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 700; color: #c2410c; line-height: 1; }
        .carousel--68 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(194,65,12,0.1); }
        .carousel--68 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--68 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--68 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--68 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; text-align: center; color: #7c2d12; }
        .carousel--68 .carousel__content p { color: #92400e; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--68 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #c2410c; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ============================================
// V69: THUMBNAIL STRIP (Based on V54)
// ============================================
function Carousel69({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--69">
      <div className="carousel__main">
        <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        <div className="carousel__content">
          <div className="carousel__text-content">
            {slides.map((slide, idx) => (
              <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                <div className="carousel__number">{String(idx + 1).padStart(2, '0')}</div>
                <h3>{slide.title}</h3><p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="carousel__thumbnails">{slides.map((slide, idx) => (<button key={idx} className={`carousel__thumb ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><img src={slide.image} alt={slide.title} /></button>))}</div>
      <style>{`
        .carousel--69 { max-width: 1000px; margin: 0 auto; }
        .carousel--69 .carousel__main { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: stretch; margin-bottom: 1.5rem; }
        .carousel--69 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; }
        .carousel--69 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--69 .carousel__image img.active { opacity: 1; }
        .carousel--69 .carousel__content { display: flex; align-items: center; }
        .carousel--69 .carousel__number { font-family: 'Share Tech Mono', monospace; font-size: 3rem; font-weight: 700; color: #eee; text-align: center; margin-bottom: 0.5rem; }
        .carousel--69 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); width: 100%; }
        .carousel--69 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--69 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--69 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--69 .carousel__content h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; text-transform: uppercase; text-align: center; }
        .carousel--69 .carousel__content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; text-align: center; }
        .carousel--69 .carousel__btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .carousel--69 .carousel__thumbnails { display: flex; gap: 0.75rem; justify-content: center; }
        .carousel--69 .carousel__thumb { width: 80px; height: 60px; border: 2px solid transparent; border-radius: 4px; overflow: hidden; cursor: pointer; opacity: 0.5; transition: all 0.3s; padding: 0; background: none; }
        .carousel--69 .carousel__thumb.active { border-color: #1a1a1a; opacity: 1; }
        .carousel--69 .carousel__thumb img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </div>
  );
}

// ============================================
// V70: SPLIT HERO (Based on V54)
// ============================================
function Carousel70({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--70">
      <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}<div className="carousel__image-overlay"></div></div>
      <div className="carousel__panel">
        <div className="carousel__nav"><button className="carousel__arrow" onClick={prevSlide}>←</button><span>{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><button className="carousel__arrow" onClick={nextSlide}>→</button></div>
        <div className="carousel__text-content">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
              <h3>{slide.title}</h3><p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
            </div>
          ))}
        </div>
        <div className="carousel__dots">{slides.map((_, idx) => (<button key={idx} className={`carousel__dot ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />))}</div>
      </div>
      <style>{`
        .carousel--70 { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr; min-height: 450px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.1); }
        .carousel--70 .carousel__image { position: relative; }
        .carousel--70 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--70 .carousel__image img.active { opacity: 1; }
        .carousel--70 .carousel__image-overlay { position: absolute; inset: 0; background: linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3)); }
        .carousel--70 .carousel__panel { background: #1a1a1a; color: #fff; padding: 2rem; display: flex; flex-direction: column; }
        .carousel--70 .carousel__nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
        .carousel--70 .carousel__arrow { background: none; border: 1px solid rgba(255,255,255,0.3); color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1rem; transition: all 0.3s; }
        .carousel--70 .carousel__arrow:hover { background: #fff; color: #1a1a1a; }
        .carousel--70 .carousel__nav span { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(255,255,255,0.6); }
        .carousel--70 .carousel__text-content { position: relative; display: grid; flex: 1; }
        .carousel--70 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--70 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--70 .carousel__slide-content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--70 .carousel__slide-content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--70 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fff; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: auto; align-self: flex-start; }
        .carousel--70 .carousel__dots { display: flex; gap: 0.5rem; margin-top: 2rem; }
        .carousel--70 .carousel__dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(255,255,255,0.3); cursor: pointer; padding: 0; }
        .carousel--70 .carousel__dot.active { background: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V71: NUMBERED LIST STYLE (Based on V54)
// ============================================
function Carousel71({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--71">
      <div className="carousel__list">{slides.map((slide, idx) => (<button key={idx} className={`carousel__item ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__item-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__item-title">{slide.title}</span></button>))}</div>
      <div className="carousel__main">
        <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        <div className="carousel__text-content">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
              <p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .carousel--71 { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 250px 1fr; gap: 3rem; }
        .carousel--71 .carousel__list { display: flex; flex-direction: column; gap: 0.25rem; }
        .carousel--71 .carousel__item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: none; border: none; cursor: pointer; text-align: left; border-left: 3px solid transparent; transition: all 0.3s; }
        .carousel--71 .carousel__item:hover { background: #f5f5f5; }
        .carousel--71 .carousel__item.active { border-left-color: #1a1a1a; background: #fff; }
        .carousel--71 .carousel__item-num { font-family: 'Share Tech Mono', monospace; font-size: 1.25rem; font-weight: 700; color: #ccc; }
        .carousel--71 .carousel__item.active .carousel__item-num { color: #1a1a1a; }
        .carousel--71 .carousel__item-title { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #999; }
        .carousel--71 .carousel__item.active .carousel__item-title { color: #1a1a1a; }
        .carousel--71 .carousel__main { display: flex; flex-direction: column; gap: 1.5rem; }
        .carousel--71 .carousel__image { position: relative; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; }
        .carousel--71 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--71 .carousel__image img.active { opacity: 1; }
        .carousel--71 .carousel__text-content { position: relative; display: grid; background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .carousel--71 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--71 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--71 .carousel__slide-content p { color: #666; line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; }
        .carousel--71 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; align-self: flex-start; }
      `}</style>
    </div>
  );
}

// ============================================
// V72: CARD GRID STYLE (Based on V54)
// ============================================
function Carousel72({ activeSlide, setActiveSlide }) {
  return (
    <div className="carousel carousel--72">
      <div className="carousel__featured">
        <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        <div className="carousel__text-content">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
              <span className="carousel__label">Featured Course</span>
              <h3>{slide.title}</h3><p>{slide.description}</p>
              <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel__cards">{slides.map((slide, idx) => (<button key={idx} className={`carousel__card ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}><span className="carousel__card-num">{String(idx + 1).padStart(2, '0')}</span><span className="carousel__card-title">{slide.title}</span></button>))}</div>
      <style>{`
        .carousel--72 { max-width: 1000px; margin: 0 auto; }
        .carousel--72 .carousel__featured { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; align-items: stretch; }
        .carousel--72 .carousel__image { position: relative; border-radius: 12px; overflow: hidden; min-height: 300px; }
        .carousel--72 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--72 .carousel__image img.active { opacity: 1; }
        .carousel--72 .carousel__text-content { position: relative; display: grid; background: #1a1a1a; color: #fff; border-radius: 12px; padding: 2rem; }
        .carousel--72 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--72 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--72 .carousel__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .carousel--72 .carousel__slide-content h3 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; text-transform: uppercase; }
        .carousel--72 .carousel__slide-content p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 1.5rem; font-size: 0.95rem; flex: 1; }
        .carousel--72 .carousel__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fff; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; align-self: flex-start; }
        .carousel--72 .carousel__cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
        .carousel--72 .carousel__card { padding: 1.25rem; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.3s; }
        .carousel--72 .carousel__card:hover { border-color: #999; }
        .carousel--72 .carousel__card.active { border-color: #1a1a1a; background: #fafafa; }
        .carousel--72 .carousel__card-num { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; color: #ddd; margin-bottom: 0.5rem; }
        .carousel--72 .carousel__card.active .carousel__card-num { color: #1a1a1a; }
        .carousel--72 .carousel__card-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #666; }
      `}</style>
    </div>
  );
}

// ============================================
// V73: COMPACT STYLE (Based on V54)
// ============================================
function Carousel73({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--73">
      <div className="carousel__body">
        <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
        <div className="carousel__content">
          <div className="carousel__nav"><button className="carousel__arrow" onClick={prevSlide}>‹</button><span>{String(activeSlide + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}</span><button className="carousel__arrow" onClick={nextSlide}>›</button></div>
          <div className="carousel__text-content">
            {slides.map((slide, idx) => (
              <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                <h3>{slide.title}</h3><p>{slide.description}</p>
                <Link to={slide.link} className="carousel__btn">{slide.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .carousel--73 { max-width: 700px; margin: 0 auto; }
        .carousel--73 .carousel__body { display: grid; grid-template-columns: 1fr 1fr; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
        .carousel--73 .carousel__image { position: relative; min-height: 280px; }
        .carousel--73 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; }
        .carousel--73 .carousel__image img.active { opacity: 1; }
        .carousel--73 .carousel__content { padding: 1.5rem; display: flex; flex-direction: column; }
        .carousel--73 .carousel__nav { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .carousel--73 .carousel__arrow { width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 50%; background: #fff; cursor: pointer; font-size: 1.25rem; color: #999; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .carousel--73 .carousel__arrow:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .carousel--73 .carousel__nav span { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; }
        .carousel--73 .carousel__text-content { position: relative; display: grid; flex: 1; }
        .carousel--73 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--73 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--73 .carousel__slide-content h3 { font-size: 1rem; font-weight: 700; margin: 0 0 0.5rem; text-transform: uppercase; }
        .carousel--73 .carousel__slide-content p { color: #666; line-height: 1.6; margin: 0; font-size: 0.85rem; flex: 1; }
        .carousel--73 .carousel__btn { color: #1a1a1a; text-decoration: none; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1rem; }
        .carousel--73 .carousel__btn:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

// ============================================
// V74: ELEGANT SERIF (Based on V54)
// ============================================
function Carousel74({ activeSlide, setActiveSlide }) {
  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);
  return (
    <div className="carousel carousel--74">
      <div className="carousel__header"><span className="carousel__counter">{String(activeSlide + 1).padStart(2, '0')}</span><div className="carousel__line"></div><span className="carousel__total">{String(slides.length).padStart(2, '0')}</span></div>
      <div className="carousel__body">
        <button className="carousel__arrow" onClick={prevSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1"/><polyline points="14 4 6 10 14 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg></button>
        <div className="carousel__main">
          <div className="carousel__image">{slides.map((slide, idx) => (<img key={idx} src={slide.image} alt={slide.title} className={idx === activeSlide ? 'active' : ''} />))}</div>
          <div className="carousel__content">
            <div className="carousel__text-content">
              {slides.map((slide, idx) => (
                <div key={idx} className={`carousel__slide-content ${idx === activeSlide ? 'active' : ''}`}>
                  <h3>{slide.title}</h3><p>{slide.description}</p>
                  <Link to={slide.link} className="carousel__btn"><span>{slide.cta}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1"/></svg></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="carousel__arrow" onClick={nextSlide}><svg width="48" height="20" viewBox="0 0 48 20"><line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="1"/><polyline points="34 4 42 10 34 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg></button>
      </div>
      <div className="carousel__tabs">{slides.map((slide, idx) => (<button key={idx} className={`carousel__tab ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>{slide.title}</button>))}</div>
      <style>{`
        .carousel--74 { max-width: 1000px; margin: 0 auto; font-family: 'Playfair Display', Georgia, serif; }
        .carousel--74 .carousel__header { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; }
        .carousel--74 .carousel__counter, .carousel--74 .carousel__total { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #999; }
        .carousel--74 .carousel__line { width: 60px; height: 1px; background: #ddd; }
        .carousel--74 .carousel__body { display: flex; align-items: center; gap: 2rem; }
        .carousel--74 .carousel__arrow { padding: 1rem; border: none; background: transparent; cursor: pointer; color: #999; transition: color 0.3s; }
        .carousel--74 .carousel__arrow:hover { color: #1a1a1a; }
        .carousel--74 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: stretch; }
        .carousel--74 .carousel__image { position: relative; border-radius: 4px; overflow: hidden; }
        .carousel--74 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.7s ease; }
        .carousel--74 .carousel__image img.active { opacity: 1; }
        .carousel--74 .carousel__content { display: flex; align-items: center; }
        .carousel--74 .carousel__text-content { position: relative; display: grid; }
        .carousel--74 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; }
        .carousel--74 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--74 .carousel__slide-content h3 { font-size: 2rem; font-weight: 400; margin: 0 0 1.5rem; font-style: italic; }
        .carousel--74 .carousel__slide-content p { color: #666; line-height: 1.8; margin: 0 0 2rem; font-size: 1rem; font-family: -apple-system, sans-serif; }
        .carousel--74 .carousel__btn { display: inline-flex; align-items: center; gap: 0.75rem; color: #1a1a1a; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; font-family: -apple-system, sans-serif; border-bottom: 1px solid #1a1a1a; padding-bottom: 0.25rem; }
        .carousel--74 .carousel__tabs { display: flex; justify-content: center; gap: 2rem; margin-top: 2.5rem; flex-wrap: wrap; }
        .carousel--74 .carousel__tab { background: none; border: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; cursor: pointer; padding: 0.5rem 0; border-bottom: 1px solid transparent; font-family: -apple-system, sans-serif; }
        .carousel--74 .carousel__tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// CAROUSEL VARIATIONS MAP
// ============================================

const carouselComponents = {
  'carousel-1': Carousel1,
  'carousel-2': Carousel2,
  'carousel-3': Carousel3,
  'carousel-4': Carousel4,
  'carousel-5': Carousel5,
  'carousel-6': Carousel6,
  'carousel-7': Carousel7,
  'carousel-8': Carousel8,
  'carousel-9': Carousel9,
  'carousel-10': Carousel10,
  'carousel-11': Carousel11,
  'carousel-12': Carousel12,
  'carousel-13': Carousel13,
  'carousel-14': Carousel14,
  'carousel-15': Carousel15,
  'carousel-16': Carousel16,
  'carousel-17': Carousel17,
  'carousel-18': Carousel18,
  'carousel-19': Carousel19,
  'carousel-20': Carousel20,
  'carousel-21': Carousel21,
  'carousel-22': Carousel22,
  'carousel-23': Carousel23,
  'carousel-24': Carousel24,
  'carousel-25': Carousel25,
  'carousel-26': Carousel26,
  'carousel-27': Carousel27,
  'carousel-28': Carousel28,
  'carousel-29': Carousel29,
  'carousel-30': Carousel30,
  'carousel-31': Carousel31,
  'carousel-32': Carousel32,
  'carousel-33': Carousel33,
  'carousel-34': Carousel34,
  'carousel-35': Carousel35,
  'carousel-36': Carousel36,
  'carousel-37': Carousel37,
  'carousel-38': Carousel38,
  'carousel-39': Carousel39,
  'carousel-40': Carousel40,
  'carousel-41': Carousel41,
  'carousel-42': Carousel42,
  'carousel-43': Carousel43,
  'carousel-44': Carousel44,
  'carousel-45': Carousel45,
  'carousel-46': Carousel46,
  'carousel-47': Carousel47,
  'carousel-48': Carousel48,
  'carousel-49': Carousel49,
  'carousel-50': Carousel50,
  'carousel-51': Carousel51,
  'carousel-52': Carousel52,
  'carousel-53': Carousel53,
  'carousel-54': Carousel54,
  'carousel-55': Carousel55,
  'carousel-56': Carousel56,
  'carousel-57': Carousel57,
  'carousel-58': Carousel58,
  'carousel-59': Carousel59,
  'carousel-60': Carousel60,
  'carousel-61': Carousel61,
  'carousel-62': Carousel62,
  'carousel-63': Carousel63,
  'carousel-64': Carousel64,
  'carousel-65': Carousel65,
  'carousel-66': Carousel66,
  'carousel-67': Carousel67,
  'carousel-68': Carousel68,
  'carousel-69': Carousel69,
  'carousel-70': Carousel70,
  'carousel-71': Carousel71,
  'carousel-72': Carousel72,
  'carousel-73': Carousel73,
  'carousel-74': Carousel74,
  'carousel-75': Carousel75,
  'carousel-76': Carousel76,
  'carousel-77': Carousel77,
  'carousel-78': Carousel78,
  'carousel-79': Carousel79,
  'carousel-80': Carousel80,
  'carousel-81': Carousel81,
  'carousel-82': Carousel82,
  'carousel-83': Carousel83,
  'carousel-84': Carousel84,
  'carousel-85': Carousel85,
  'carousel-86': Carousel86,
  'carousel-87': Carousel87,
  'carousel-88': Carousel88,
  'carousel-89': Carousel89,
  'carousel-90': Carousel90,
  'carousel-91': Carousel91,
  'carousel-92': Carousel92,
  'carousel-93': Carousel93,
  'carousel-94': Carousel94,
  'carousel-95': Carousel95,
  'carousel-96': Carousel96,
  'carousel-97': Carousel97,
};

// ============================================
// PICKER SECTIONS
// ============================================

const sections = {
  carousels: [
    { id: 'carousel-1', name: 'Base (V14)', category: 'Base', desc: 'Original dark split layout' },
    { id: 'carousel-2', name: 'Giant Number Overlay', category: 'Number', desc: '8rem number overlaying the image' },
    { id: 'carousel-3', name: 'Inset + Shadow', category: 'Image', desc: 'Padded image with deep shadow' },
    { id: 'carousel-4', name: 'Number Beside Title', category: 'Number', desc: 'Number inline with heading' },
    { id: 'carousel-5', name: 'Floating Center', category: 'Number', desc: '12rem ghost number in center' },
    { id: 'carousel-6', name: 'Glow Effect', category: 'Image', desc: 'Smaller image with glow, drop-in number' },
    { id: 'carousel-7', name: 'Vertical Bar', category: 'Layout', desc: 'Vertical number bar + zoom image' },
    { id: 'carousel-8', name: 'Gradient + Bottom', category: 'Layout', desc: 'Corner gradient, number with sticks' },
    { id: 'carousel-9', name: 'Circle Badge', category: 'Number', desc: 'White circle badge with pop animation' },
    { id: 'carousel-10', name: 'Outline Number', category: 'Number', desc: 'Stroke-only number + grayscale transition' },
    { id: 'carousel-11', name: 'Diagonal Split', category: 'Layout', desc: 'Skewed divider between sections' },
    { id: 'carousel-12', name: 'Wider Image', category: 'Image', desc: '1.4:1 ratio image, giant faded number' },
    { id: 'carousel-13', name: 'Blur Transition', category: 'Animation', desc: 'Blur-to-sharp image + number reveal' },
    { id: 'carousel-14', name: 'Stacked Cards', category: 'Animation', desc: 'Card stack with flip number' },
    { id: 'carousel-15', name: 'Clip Reveal', category: 'Animation', desc: 'Horizontal reveal + slide-up number' },
    { id: 'carousel-16', name: 'Polaroid', category: 'Image', desc: 'Photo frame style with drop animation' },
    { id: 'carousel-17', name: 'Cinema Bars', category: 'Image', desc: 'Letterbox bars + corner number' },
    { id: 'carousel-18', name: 'Offset Image', category: 'Image', desc: 'Image breaking out of bounds' },
    { id: 'carousel-19', name: 'Rotate In', category: 'Animation', desc: 'Slight rotation + 3D number flip' },
    { id: 'carousel-20', name: 'Border Frame', category: 'Image', desc: 'Decorative border + typing effect' },
    // Original carousels from CarouselPicker.jsx
    { id: 'carousel-21', name: 'Fade', category: 'Classic', desc: 'Clean fade transition between slides' },
    { id: 'carousel-22', name: 'Horizontal Slide', category: 'Classic', desc: 'Traditional horizontal sliding with large numbers' },
    { id: 'carousel-23', name: 'Cover Flow 3D', category: '3D', desc: 'Apple-inspired 3D perspective rotation' },
    { id: 'carousel-24', name: 'Card Stack', category: 'Stack', desc: 'Cards stacked that slide away on navigate' },
    { id: 'carousel-25', name: 'Tabs + Center', category: 'Navigation', desc: 'Tab navigation with center-focused slides' },
    { id: 'carousel-26', name: 'Vertical Sidebar', category: 'Layout', desc: 'Sidebar navigation with vertical sliding' },
    { id: 'carousel-27', name: 'Filmstrip', category: 'Thumbnails', desc: 'Centered filmstrip with thumbnail navigation' },
    { id: 'carousel-28', name: 'Split Screen Dark', category: 'Editorial', desc: 'Dark split-screen with progress bar' },
    { id: 'carousel-29', name: 'Minimal Arrows', category: 'Minimal', desc: 'Clean minimal with large arrow buttons' },
    { id: 'carousel-30', name: 'Editorial Magazine', category: 'Magazine', desc: 'Magazine-style with hero image and thumbnails' },
    // Restored original V11 and V21 layouts
    { id: 'carousel-31', name: 'Original V11 Layout', category: 'Restored', desc: 'Image | divider | content with tabs and animations' },
    { id: 'carousel-32', name: 'Long Arrow Thick', category: 'Restored', desc: 'V11 layout with Long Arrow Thick SVG navigation' },
    // Creative variations based on V32
    { id: 'carousel-33', name: 'Giant Number Overlay', category: 'Number', desc: '8rem number on image corner with slideUp' },
    { id: 'carousel-34', name: 'Inset Deep Shadow', category: 'Image', desc: 'Padded image with 30px deep shadow' },
    { id: 'carousel-35', name: 'Number Beside Title', category: 'Number', desc: 'Inline number next to heading' },
    { id: 'carousel-36', name: 'Vertical Number Bar', category: 'Layout', desc: 'Number in vertical accent bar' },
    { id: 'carousel-37', name: 'Blur-to-Sharp', category: 'Animation', desc: 'Image starts blurred, sharpens on transition' },
    { id: 'carousel-38', name: 'Circle Badge', category: 'Number', desc: 'Number in white circle badge with pop' },
    { id: 'carousel-39', name: 'Outline Stroke', category: 'Number', desc: 'Hollow stroke number + grayscale image' },
    { id: 'carousel-40', name: 'Polaroid Frame', category: 'Image', desc: 'Photo frame with shadow and caption' },
    { id: 'carousel-41', name: 'Wider Image 1.5:1', category: 'Image', desc: 'Landscape ratio with ghost number' },
    { id: 'carousel-42', name: 'Clip-Path Reveal', category: 'Animation', desc: 'Horizontal clip-path reveal transition' },
    { id: 'carousel-43', name: 'Rounded Glow', category: 'Image', desc: 'Rounded corners with colored glow' },
    { id: 'carousel-44', name: 'Tilted Image', category: 'Animation', desc: 'Slight rotation with tilt animation' },
    { id: 'carousel-45', name: 'Floating Center Giant', category: 'Number', desc: '12rem ghost number center overlay' },
    { id: 'carousel-46', name: 'Gradient Overlay', category: 'Image', desc: 'Blue gradient overlay on image' },
    { id: 'carousel-47', name: 'Border Frame', category: 'Image', desc: 'Decorative inset border frame' },
    { id: 'carousel-48', name: 'Zoom In', category: 'Animation', desc: 'Image zooms in on transition' },
    { id: 'carousel-49', name: 'Offset Breaking', category: 'Image', desc: 'Image extends beyond container bounds' },
    { id: 'carousel-50', name: 'Number Behind', category: 'Number', desc: 'Giant number layered behind image' },
    { id: 'carousel-51', name: 'Elastic Bounce', category: 'Animation', desc: 'Bouncy elastic animation on content' },
    { id: 'carousel-52', name: 'Stacked Cards', category: 'Animation', desc: 'Card stack with peek effect' },
    // V49 variants
    { id: 'carousel-53', name: 'Giant Number in Image', category: 'Number', desc: '12rem number centered in image with scale animation' },
    { id: 'carousel-54', name: 'Number Beside Title', category: 'Number', desc: 'Number inline next to heading' },
    // V54-based variations
    { id: 'carousel-55', name: 'Dark Mode', category: 'Theme', desc: 'Dark background with inverted colors' },
    { id: 'carousel-56', name: 'Image on Right', category: 'Layout', desc: 'Swapped layout with content on left' },
    { id: 'carousel-57', name: 'Blue Accent', category: 'Theme', desc: 'Blue accent color throughout' },
    { id: 'carousel-58', name: 'Minimal No Divider', category: 'Minimal', desc: 'Clean layout without center divider' },
    { id: 'carousel-59', name: 'Large Number Overlay', category: 'Number', desc: 'Giant number on image corner' },
    { id: 'carousel-60', name: 'Rounded + Circle Arrows', category: 'Style', desc: 'Extra rounded corners with circle nav buttons' },
    { id: 'carousel-61', name: 'Vertical Layout', category: 'Layout', desc: 'Stacked vertical layout with circle tabs' },
    { id: 'carousel-62', name: 'Pill Tabs', category: 'Navigation', desc: 'Rounded pill-shaped tab buttons' },
    { id: 'carousel-63', name: 'Gradient Accent', category: 'Theme', desc: 'Pink to purple gradient accents' },
    { id: 'carousel-64', name: 'Boxed Numbers', category: 'Style', desc: 'Square number boxes with sharp edges' },
    { id: 'carousel-65', name: 'Side Number Bar', category: 'Layout', desc: 'Vertical number bar on left side' },
    { id: 'carousel-66', name: 'Progress Bar', category: 'Navigation', desc: 'Top progress bar with centered title' },
    { id: 'carousel-67', name: 'Outline Style', category: 'Style', desc: 'Border-only elements with outline number' },
    { id: 'carousel-68', name: 'Warm Tones', category: 'Theme', desc: 'Warm orange and cream color palette' },
    { id: 'carousel-69', name: 'Thumbnail Strip', category: 'Navigation', desc: 'Bottom thumbnail strip for navigation' },
    { id: 'carousel-70', name: 'Split Hero', category: 'Layout', desc: 'Hero image with dark side panel' },
    { id: 'carousel-71', name: 'Numbered List', category: 'Navigation', desc: 'Left sidebar with numbered list items' },
    { id: 'carousel-72', name: 'Card Grid', category: 'Layout', desc: 'Featured card with grid navigation' },
    { id: 'carousel-73', name: 'Compact Style', category: 'Minimal', desc: 'Smaller, compact two-column layout' },
    { id: 'carousel-74', name: 'Elegant Serif', category: 'Style', desc: 'Sophisticated serif typography' },
    { id: 'carousel-75', name: 'Light Mode Card', category: 'Theme', desc: 'White background with card container and shadow' },
    { id: 'carousel-76', name: 'Light + Progress + Right Image', category: 'Layout', desc: 'Light mode with progress bar and image on right' },
    { id: 'carousel-77', name: 'Dark Card + Progress + Right Image', category: 'Layout', desc: 'Dark content card with progress bar and image on right' },
    { id: 'carousel-78', name: 'Deep Shadow + Scale', category: 'Shadow', desc: 'Deep box shadow with image scale animation' },
    { id: 'carousel-79', name: 'Navy Blue + Slide Up', category: 'Theme', desc: 'Navy blue theme with slide up image animation' },
    { id: 'carousel-80', name: 'Emerald Green + Glow', category: 'Theme', desc: 'Emerald green with glowing image shadow' },
    { id: 'carousel-81', name: 'Warm Sunset + Rotate', category: 'Theme', desc: 'Warm amber gradient with rotate image animation' },
    { id: 'carousel-82', name: 'Purple Gradient + Blur', category: 'Animation', desc: 'Purple gradient with blur to sharp image transition' },
    { id: 'carousel-83', name: 'Rose Pink + Float Shadow', category: 'Shadow', desc: 'Rose pink with floating elliptical shadow' },
    { id: 'carousel-84', name: 'Slate Gray + Inset', category: 'Shadow', desc: 'Slate gray with inset shadow effects' },
    { id: 'carousel-85', name: 'Cyan + Slide Right', category: 'Animation', desc: 'Cyan theme with slide from left image animation' },
    { id: 'carousel-86', name: 'Dark Charcoal + Border Glow', category: 'Theme', desc: 'Dark charcoal with subtle border glow' },
    { id: 'carousel-87', name: 'Lime Green + Zoom Out', category: 'Animation', desc: 'Lime green with zoom out image animation' },
    { id: 'carousel-88', name: 'Coral + Double Border', category: 'Style', desc: 'Coral pink with double border on image' },
    { id: 'carousel-89', name: 'Indigo Deep + Clip Path', category: 'Animation', desc: 'Indigo deep with clip-path reveal animation' },
    { id: 'carousel-90', name: 'Teal + Layered Shadow', category: 'Shadow', desc: 'Teal with stacked layered shadows' },
    { id: 'carousel-91', name: 'Dark Blue + Neon Glow', category: 'Theme', desc: 'Dark blue with neon cyan glow effects' },
    { id: 'carousel-92', name: 'Cream + Sepia Filter', category: 'Animation', desc: 'Cream theme with sepia to color image transition' },
    { id: 'carousel-93', name: 'Fuchsia + Grayscale', category: 'Animation', desc: 'Fuchsia with grayscale to color image transition' },
    { id: 'carousel-94', name: 'Stone + Rounded', category: 'Style', desc: 'Stone gray with extra rounded corners' },
    { id: 'carousel-95', name: 'Midnight + Gradient Progress', category: 'Theme', desc: 'Midnight purple with gradient progress bar' },
    { id: 'carousel-96', name: 'Orange Vibrant + Lift', category: 'Shadow', desc: 'Vibrant orange with lift shadow on hover' },
    { id: 'carousel-97', name: 'Minimal White + Outline', category: 'Minimal', desc: 'Minimal white with outline-only elements' },
  ],
};

const tabs = [
  { key: 'carousels', label: 'Carousel Variations', color: 'blue' },
];

// ============================================
// MAIN COMPONENT
// ============================================

function CarouselPickerV2() {
  const [currentItem, setCurrentItem] = useState(sections.carousels[0]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [currentItem]);

  const CarouselComponent = carouselComponents[currentItem?.id];

  return (
    <div className="carousel-picker-v2">
      <div className="carousel-picker-v2__preview">
        <div className="carousel-picker-v2__header">
          <h1>Training Courses</h1>
          <p>Explore our comprehensive helicopter training programs</p>
        </div>

        <div className="carousel-picker-v2__carousel">
          {CarouselComponent && (
            <CarouselComponent
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
            />
          )}
        </div>
      </div>

      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="hq-carousel-picker-v2-favorites"
        title="Carousel Picker V2"
        onItemSelect={setCurrentItem}
        initialIndex={0}
      />

      <style>{`
        .carousel-picker-v2 {
          min-height: 100vh;
          background: #faf9f6;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
        .carousel-picker-v2__preview {
          padding: 4rem 2rem 10rem;
        }
        .carousel-picker-v2__header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .carousel-picker-v2__header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .carousel-picker-v2__header p {
          color: #666;
          margin: 0;
        }
        .carousel-picker-v2__carousel {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default CarouselPickerV2;

/**
 * VIDEO SLIDER PICKER - 20 Variations
 * Following HQ Aviation Brand Identity
 * Aesthetic: Luxury Minimal Aviation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const videos = [
  { videoUrl: 'https://youtu.be/ey2WYARj5bE', title: 'Greenland Mission', desc: 'Exploring abandoned mining camps, crossing the ice cap to Dye 2 station.' },
  { videoUrl: 'https://youtu.be/k4LQeSkGC4M', title: 'Keebird: High Arctic', desc: 'A journey to the extreme north of Greenland, landing at Keebird (85° North).' },
  { videoUrl: 'https://youtu.be/xO7RlObDdjM', title: 'Alps Mission', desc: 'Flying through the breathtaking snow-covered peaks and valleys of the Alps.' },
  { videoUrl: 'https://youtu.be/Vm8MOmC90o4', title: '3 North Poles', desc: 'The epic expedition featuring champagne on the ice and survival challenges.' },
  { videoUrl: 'https://youtu.be/2sDIFT6ZqN4', title: 'Pole to Pole', desc: 'The first helicopter flight from the North Pole to the South Pole.' },
];

function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// ============================================
// V1: SIDE BY SIDE - Video left, info right
// ============================================
function VideoSlider1({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--1">
      <div className="vs__layout">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__content">
          <span className="vs__counter">{String(currentIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
          <h3 className="vs__title">{video.title}</h3>
          <p className="vs__desc">{video.desc}</p>
          <div className="vs__nav">
            {videos.map((_, i) => (
              <button key={i} className={`vs__dot ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
            ))}
          </div>
        </div>
      </div>
      <div className="vs__thumbs">
        {videos.map((v, i) => (
          <div key={i} className={`vs__thumb ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
            <img src={`https://img.youtube.com/vi/${getYouTubeID(v.videoUrl)}/mqdefault.jpg`} alt={v.title} />
            <span>{v.title}</span>
          </div>
        ))}
      </div>
      <style>{`
        .vs--1 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; padding: 4rem 2rem; }
        .vs--1 .vs__layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; max-width: 1100px; margin: 0 auto 2rem; align-items: center; }
        .vs--1 .vs__video-wrap { position: relative; padding-bottom: 56.25%; background: #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .vs--1 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--1 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
        .vs--1 .vs__title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #1a1a1a; margin: 0.5rem 0 1rem; text-transform: uppercase; }
        .vs--1 .vs__desc { font-size: 1rem; color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
        .vs--1 .vs__nav { display: flex; gap: 0.75rem; }
        .vs--1 .vs__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; transition: all 0.3s ease; }
        .vs--1 .vs__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .vs--1 .vs__thumbs { display: flex; gap: 1rem; max-width: 1100px; margin: 0 auto; overflow-x: auto; padding-bottom: 0.5rem; }
        .vs--1 .vs__thumb { flex: 0 0 160px; cursor: pointer; opacity: 0.5; transition: all 0.3s ease; }
        .vs--1 .vs__thumb.active { opacity: 1; }
        .vs--1 .vs__thumb img { width: 100%; height: 90px; object-fit: cover; border-radius: 4px; display: block; margin-bottom: 0.5rem; }
        .vs--1 .vs__thumb span { font-size: 0.75rem; color: #666; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  );
}

// ============================================
// V2: STACKED - Video on top, info below
// ============================================
function VideoSlider2({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--2">
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__info">
        <div className="vs__meta">
          <span className="vs__label">Expedition Film</span>
          <span className="vs__counter">{String(currentIndex + 1).padStart(2, '0')}</span>
        </div>
        <h3>{video.title}</h3>
        <p>{video.desc}</p>
      </div>
      <div className="vs__sticks">
        {videos.map((_, i) => (
          <button key={i} className={`vs__stick ${i <= currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
        ))}
      </div>
      <style>{`
        .vs--2 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #fff; padding: 4rem 2rem; max-width: 900px; margin: 0 auto; text-align: center; }
        .vs--2 .vs__video-wrap { position: relative; padding-bottom: 56.25%; background: #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .vs--2 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--2 .vs__info { padding: 2rem 0; max-width: 600px; margin: 0 auto; }
        .vs--2 .vs__meta { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
        .vs--2 .vs__label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
        .vs--2 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 700; color: #1a1a1a; line-height: 1; }
        .vs--2 h3 { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.75rem; text-transform: uppercase; }
        .vs--2 p { font-size: 1rem; color: #666; line-height: 1.7; margin: 0; }
        .vs--2 .vs__sticks { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .vs--2 .vs__stick { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; transition: all 0.3s ease; }
        .vs--2 .vs__stick.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V3: DARK THEME - Dark background variant
// ============================================
function VideoSlider3({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--3">
      <div className="vs__header">
        <span className="vs__pre">Expedition Films</span>
        <div className="vs__divider" />
      </div>
      <div className="vs__main">
        <button className="vs__arrow vs__arrow--prev" onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>←</button>
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <button className="vs__arrow vs__arrow--next" onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>→</button>
      </div>
      <div className="vs__footer">
        <span className="vs__counter">{String(currentIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
        <h3>{video.title}</h3>
      </div>
      <style>{`
        .vs--3 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #1a1a1a; padding: 4rem 2rem; }
        .vs--3 .vs__header { text-align: center; margin-bottom: 2rem; }
        .vs--3 .vs__pre { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .vs--3 .vs__divider { width: 40px; height: 1px; background: rgba(255,255,255,0.3); margin: 1rem auto 0; }
        .vs--3 .vs__main { display: flex; align-items: center; gap: 2rem; max-width: 1000px; margin: 0 auto; }
        .vs--3 .vs__arrow { background: none; border: 1px solid rgba(255,255,255,0.3); color: #fff; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 1.25rem; transition: all 0.3s ease; flex-shrink: 0; }
        .vs--3 .vs__arrow:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .vs--3 .vs__video-wrap { flex: 1; position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; }
        .vs--3 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--3 .vs__footer { text-align: center; margin-top: 2rem; color: #fff; }
        .vs--3 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.5rem; }
        .vs--3 h3 { font-size: 1.25rem; font-weight: 700; margin: 0; text-transform: uppercase; }
      `}</style>
    </div>
  );
}

// ============================================
// V4: SPLIT SCREEN - 50/50 layout
// ============================================
function VideoSlider4({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--4">
      <div className="vs__left">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
      </div>
      <div className="vs__right">
        <span className="vs__label">Expedition Films</span>
        <div className="vs__list">
          {videos.map((v, i) => (
            <div key={i} className={`vs__item ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
              <span className="vs__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="vs__name">{v.title}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .vs--4 { font-family: 'Space Grotesk', -apple-system, sans-serif; display: grid; grid-template-columns: 1fr 1fr; min-height: 450px; }
        .vs--4 .vs__left { background: #1a1a1a; display: flex; align-items: center; padding: 2rem; }
        .vs--4 .vs__video-wrap { width: 100%; position: relative; padding-bottom: 56.25%; border-radius: 4px; overflow: hidden; }
        .vs--4 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--4 .vs__right { background: #faf9f6; padding: 2rem; display: flex; flex-direction: column; }
        .vs--4 .vs__label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 1.5rem; }
        .vs--4 .vs__list { flex: 1; }
        .vs--4 .vs__item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #e8e6e2; cursor: pointer; transition: all 0.3s ease; }
        .vs--4 .vs__item:hover { padding-left: 0.5rem; }
        .vs--4 .vs__item.active { border-left: 2px solid #1a1a1a; padding-left: 1rem; margin-left: -1rem; }
        .vs--4 .vs__num { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; }
        .vs--4 .vs__item.active .vs__num { color: #1a1a1a; }
        .vs--4 .vs__name { font-size: 0.9rem; font-weight: 500; color: #666; }
        .vs--4 .vs__item.active .vs__name { color: #1a1a1a; font-weight: 600; }
      `}</style>
    </div>
  );
}

// ============================================
// V5: LARGE COUNTER - Big number focus
// ============================================
function VideoSlider5({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--5">
      <div className="vs__counter">{String(currentIndex + 1).padStart(2, '0')}</div>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__info">
        <h3>{video.title}</h3>
        <div className="vs__nav">
          <button onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>Previous</button>
          <span className="vs__of">of {String(videos.length).padStart(2, '0')}</span>
          <button onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>Next</button>
        </div>
      </div>
      <style>{`
        .vs--5 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #fff; padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .vs--5 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 6rem; font-weight: 700; color: #e8e6e2; line-height: 1; margin-bottom: -1rem; position: relative; z-index: 0; }
        .vs--5 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); z-index: 1; }
        .vs--5 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--5 .vs__info { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
        .vs--5 h3 { font-size: 1.25rem; font-weight: 700; color: #1a1a1a; margin: 0; text-transform: uppercase; }
        .vs--5 .vs__nav { display: flex; align-items: center; gap: 1.5rem; }
        .vs--5 .vs__nav button { background: none; border: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; cursor: pointer; padding-bottom: 0.25rem; border-bottom: 1px solid #ccc; transition: all 0.3s ease; }
        .vs--5 .vs__nav button:hover { border-color: #1a1a1a; }
        .vs--5 .vs__of { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; }
      `}</style>
    </div>
  );
}

// ============================================
// V6: MINIMAL - Ultra clean
// ============================================
function VideoSlider6({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--6">
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__bar">
        {videos.map((_, i) => (
          <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)} />
        ))}
      </div>
      <style>{`
        .vs--6 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; padding: 4rem 2rem; max-width: 800px; margin: 0 auto; }
        .vs--6 .vs__video-wrap { position: relative; padding-bottom: 56.25%; background: #1a1a1a; }
        .vs--6 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--6 .vs__bar { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
        .vs--6 .vs__bar button { width: 50px; height: 2px; background: #e0e0e0; border: none; cursor: pointer; transition: all 0.3s ease; }
        .vs--6 .vs__bar button.active { background: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// V7: TABS NAVIGATION - Tab-based selection
// ============================================
function VideoSlider7({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--7">
      <div className="vs__tabs">
        {videos.map((v, i) => (
          <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)}>{v.title}</button>
        ))}
      </div>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <p className="vs__desc">{video.desc}</p>
      <style>{`
        .vs--7 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #fff; padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .vs--7 .vs__tabs { display: flex; flex-wrap: wrap; gap: 0; border-bottom: 1px solid #e8e6e2; margin-bottom: 2rem; }
        .vs--7 .vs__tabs button { background: none; border: none; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; cursor: pointer; transition: all 0.3s ease; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .vs--7 .vs__tabs button:hover { color: #1a1a1a; }
        .vs--7 .vs__tabs button.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
        .vs--7 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; }
        .vs--7 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--7 .vs__desc { font-size: 1rem; color: #666; line-height: 1.7; margin: 1.5rem 0 0; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto; }
      `}</style>
    </div>
  );
}

// ============================================
// V8: BORDERED - Strong border treatment
// ============================================
function VideoSlider8({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--8">
      <div className="vs__frame">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__caption">
          <span className="vs__idx">{String(currentIndex + 1).padStart(2, '0')}</span>
          <h3>{video.title}</h3>
          <div className="vs__arrows">
            <button onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>←</button>
            <button onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>→</button>
          </div>
        </div>
      </div>
      <style>{`
        .vs--8 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; padding: 4rem 2rem; }
        .vs--8 .vs__frame { max-width: 900px; margin: 0 auto; border: 1px solid #1a1a1a; }
        .vs--8 .vs__video-wrap { position: relative; padding-bottom: 56.25%; }
        .vs--8 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--8 .vs__caption { display: flex; align-items: center; padding: 1rem 1.5rem; border-top: 1px solid #1a1a1a; background: #fff; }
        .vs--8 .vs__idx { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-right: 1.5rem; }
        .vs--8 h3 { flex: 1; font-size: 1rem; font-weight: 600; color: #1a1a1a; margin: 0; text-transform: uppercase; }
        .vs--8 .vs__arrows { display: flex; gap: 0; }
        .vs--8 .vs__arrows button { background: #1a1a1a; color: #fff; border: none; width: 40px; height: 40px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; }
        .vs--8 .vs__arrows button:hover { background: #333; }
      `}</style>
    </div>
  );
}

// ============================================
// V9: THUMBNAIL GRID - Grid below video
// ============================================
function VideoSlider9({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--9">
      <span className="vs__label">Expedition Films</span>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <h3>{video.title}</h3>
      <div className="vs__grid">
        {videos.map((v, i) => (
          <div key={i} className={`vs__cell ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
            <img src={`https://img.youtube.com/vi/${getYouTubeID(v.videoUrl)}/mqdefault.jpg`} alt={v.title} />
            <span>{String(i + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <style>{`
        .vs--9 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #fff; padding: 4rem 2rem; max-width: 900px; margin: 0 auto; text-align: center; }
        .vs--9 .vs__label { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; }
        .vs--9 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; margin: 1.5rem 0; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .vs--9 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--9 h3 { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin: 0 0 2rem; text-transform: uppercase; }
        .vs--9 .vs__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
        .vs--9 .vs__cell { cursor: pointer; position: relative; opacity: 0.5; transition: all 0.3s ease; }
        .vs--9 .vs__cell.active { opacity: 1; }
        .vs--9 .vs__cell img { width: 100%; height: 80px; object-fit: cover; border-radius: 4px; display: block; }
        .vs--9 .vs__cell span { position: absolute; bottom: 0.5rem; right: 0.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #fff; background: rgba(0,0,0,0.6); padding: 0.15rem 0.4rem; border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ============================================
// V10: VERTICAL LIST - Sidebar list layout
// ============================================
function VideoSlider10({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--10">
      <div className="vs__sidebar">
        <span className="vs__label">Select Film</span>
        {videos.map((v, i) => (
          <div key={i} className={`vs__item ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
            <img src={`https://img.youtube.com/vi/${getYouTubeID(v.videoUrl)}/mqdefault.jpg`} alt={v.title} />
            <div className="vs__meta">
              <span className="vs__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="vs__name">{v.title}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="vs__main">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__info">
          <h3>{video.title}</h3>
          <p>{video.desc}</p>
        </div>
      </div>
      <style>{`
        .vs--10 { font-family: 'Space Grotesk', -apple-system, sans-serif; display: grid; grid-template-columns: 280px 1fr; max-width: 1200px; margin: 0 auto; background: #faf9f6; }
        .vs--10 .vs__sidebar { background: #fff; border-right: 1px solid #e8e6e2; padding: 1.5rem; max-height: 500px; overflow-y: auto; }
        .vs--10 .vs__label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
        .vs--10 .vs__item { display: flex; gap: 0.75rem; padding: 0.75rem; cursor: pointer; border-radius: 4px; transition: all 0.3s ease; margin-bottom: 0.5rem; }
        .vs--10 .vs__item:hover { background: #f5f5f2; }
        .vs--10 .vs__item.active { background: #e8e6e2; }
        .vs--10 .vs__item img { width: 60px; height: 40px; object-fit: cover; border-radius: 2px; }
        .vs--10 .vs__meta { display: flex; flex-direction: column; justify-content: center; }
        .vs--10 .vs__num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; }
        .vs--10 .vs__name { font-size: 0.75rem; font-weight: 500; color: #1a1a1a; }
        .vs--10 .vs__main { padding: 2rem; }
        .vs--10 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; }
        .vs--10 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--10 .vs__info { margin-top: 1.5rem; }
        .vs--10 h3 { font-size: 1.25rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.5rem; text-transform: uppercase; }
        .vs--10 p { font-size: 0.95rem; color: #666; line-height: 1.6; margin: 0; }
      `}</style>
    </div>
  );
}

// ============================================
// V11: COORDINATES THEME - Aviation data
// ============================================
function VideoSlider11({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--11">
      <div className="vs__data">
        <span className="vs__coord">51.5751°N</span>
        <span className="vs__divider" />
        <span className="vs__coord">0.5059°W</span>
      </div>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__footer">
        <div className="vs__left">
          <span className="vs__label">Mission</span>
          <h3>{video.title}</h3>
        </div>
        <div className="vs__right">
          <span className="vs__label">Film</span>
          <span className="vs__count">{String(currentIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="vs__dots">
        {videos.map((_, i) => (
          <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)} />
        ))}
      </div>
      <style>{`
        .vs--11 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #1a1a1a; padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .vs--11 .vs__data { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
        .vs--11 .vs__coord { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
        .vs--11 .vs__divider { width: 1px; height: 20px; background: rgba(255,255,255,0.3); }
        .vs--11 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 4px; overflow: hidden; }
        .vs--11 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--11 .vs__footer { display: flex; justify-content: space-between; margin-top: 2rem; color: #fff; }
        .vs--11 .vs__label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.25rem; }
        .vs--11 h3 { font-size: 1.1rem; font-weight: 600; margin: 0; text-transform: uppercase; }
        .vs--11 .vs__count { font-family: 'Share Tech Mono', monospace; font-size: 1.25rem; font-weight: 700; }
        .vs--11 .vs__dots { display: flex; justify-content: center; gap: 0.75rem; margin-top: 2rem; }
        .vs--11 .vs__dots button { width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: transparent; cursor: pointer; transition: all 0.3s ease; }
        .vs--11 .vs__dots button.active { background: #fff; border-color: #fff; }
      `}</style>
    </div>
  );
}

// ============================================
// V12: EDITORIAL - Magazine style
// ============================================
function VideoSlider12({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--12">
      <div className="vs__header">
        <span className="vs__issue">Volume {currentIndex + 1}</span>
        <h2>Expedition<br/>Chronicles</h2>
      </div>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__caption">
        <h3>{video.title}</h3>
        <p>{video.desc}</p>
      </div>
      <div className="vs__pager">
        {videos.map((_, i) => (
          <span key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)}>{i + 1}</span>
        ))}
      </div>
      <style>{`
        .vs--12 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; padding: 3rem 2rem; max-width: 800px; margin: 0 auto; }
        .vs--12 .vs__header { text-align: center; margin-bottom: 2rem; }
        .vs--12 .vs__issue { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #999; }
        .vs--12 h2 { font-size: 2.5rem; font-weight: 700; line-height: 1.1; margin: 0.5rem 0 0; color: #1a1a1a; text-transform: uppercase; }
        .vs--12 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border: 1px solid #e8e6e2; }
        .vs--12 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--12 .vs__caption { text-align: center; margin-top: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
        .vs--12 h3 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; text-transform: uppercase; }
        .vs--12 p { font-size: 0.95rem; color: #666; line-height: 1.7; margin: 0; }
        .vs--12 .vs__pager { display: flex; justify-content: center; gap: 1.5rem; margin-top: 2rem; }
        .vs--12 .vs__pager span { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; cursor: pointer; color: #999; transition: all 0.3s ease; }
        .vs--12 .vs__pager span.active { color: #1a1a1a; font-weight: 700; }
      `}</style>
    </div>
  );
}

// ============================================
// V13: CARD ELEVATED - Floating card
// ============================================
function VideoSlider13({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--13">
      <div className="vs__card">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__content">
          <span className="vs__counter">{String(currentIndex + 1).padStart(2, '0')}</span>
          <h3>{video.title}</h3>
          <p>{video.desc}</p>
          <div className="vs__nav">
            <button onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>← Prev</button>
            <button onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>Next →</button>
          </div>
        </div>
      </div>
      <style>{`
        .vs--13 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #e8e6e2; padding: 4rem 2rem; }
        .vs--13 .vs__card { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .vs--13 .vs__video-wrap { position: relative; padding-bottom: 56.25%; }
        .vs--13 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--13 .vs__content { padding: 2rem; }
        .vs--13 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; letter-spacing: 0.1em; }
        .vs--13 h3 { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin: 0.5rem 0 1rem; text-transform: uppercase; }
        .vs--13 p { font-size: 1rem; color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
        .vs--13 .vs__nav { display: flex; gap: 1rem; }
        .vs--13 .vs__nav button { background: #1a1a1a; color: #fff; border: none; padding: 0.75rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; }
        .vs--13 .vs__nav button:hover { background: #333; }
      `}</style>
    </div>
  );
}

// ============================================
// V14: OVERLAY INFO - Info overlaid on video
// ============================================
function VideoSlider14({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--14">
      <div className="vs__player">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__overlay">
          <span className="vs__count">{String(currentIndex + 1).padStart(2, '0')}</span>
          <h3>{video.title}</h3>
        </div>
      </div>
      <div className="vs__thumbs">
        {videos.map((v, i) => (
          <div key={i} className={`vs__thumb ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
            <img src={`https://img.youtube.com/vi/${getYouTubeID(v.videoUrl)}/mqdefault.jpg`} alt={v.title} />
          </div>
        ))}
      </div>
      <style>{`
        .vs--14 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #1a1a1a; padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .vs--14 .vs__player { position: relative; }
        .vs--14 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; }
        .vs--14 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--14 .vs__overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #fff; pointer-events: none; }
        .vs--14 .vs__count { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
        .vs--14 h3 { font-size: 1.25rem; font-weight: 700; margin: 0.25rem 0 0; text-transform: uppercase; }
        .vs--14 .vs__thumbs { display: flex; gap: 0.75rem; margin-top: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .vs--14 .vs__thumb { flex: 0 0 100px; cursor: pointer; opacity: 0.4; transition: all 0.3s ease; border-radius: 4px; overflow: hidden; }
        .vs--14 .vs__thumb.active { opacity: 1; box-shadow: 0 0 0 2px #fff; }
        .vs--14 .vs__thumb img { width: 100%; height: 60px; object-fit: cover; display: block; }
      `}</style>
    </div>
  );
}

// ============================================
// V15: ASYMMETRIC - Off-center layout
// ============================================
function VideoSlider15({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--15">
      <div className="vs__left">
        <span className="vs__label">HQ Aviation</span>
        <span className="vs__sub">Expedition Films</span>
        <div className="vs__num">{String(currentIndex + 1).padStart(2, '0')}</div>
        <div className="vs__dots">
          {videos.map((_, i) => (
            <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)} />
          ))}
        </div>
      </div>
      <div className="vs__right">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <h3>{video.title}</h3>
      </div>
      <style>{`
        .vs--15 { font-family: 'Space Grotesk', -apple-system, sans-serif; display: grid; grid-template-columns: 200px 1fr; gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; background: #faf9f6; }
        .vs--15 .vs__left { display: flex; flex-direction: column; }
        .vs--15 .vs__label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #1a1a1a; font-weight: 600; }
        .vs--15 .vs__sub { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-bottom: 2rem; }
        .vs--15 .vs__num { font-family: 'Share Tech Mono', monospace; font-size: 5rem; font-weight: 700; color: #e8e6e2; line-height: 1; margin-top: auto; }
        .vs--15 .vs__dots { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .vs--15 .vs__dots button { width: 30px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; transition: all 0.3s ease; }
        .vs--15 .vs__dots button.active { background: #1a1a1a; width: 50px; }
        .vs--15 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .vs--15 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--15 h3 { font-size: 1.25rem; font-weight: 700; color: #1a1a1a; margin: 1.5rem 0 0; text-transform: uppercase; }
      `}</style>
    </div>
  );
}

// ============================================
// V16: FULL WIDTH - Edge to edge
// ============================================
function VideoSlider16({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--16">
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
      </div>
      <div className="vs__bar">
        <div className="vs__info">
          <span className="vs__counter">{String(currentIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
          <h3>{video.title}</h3>
        </div>
        <div className="vs__arrows">
          <button onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>←</button>
          <button onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>→</button>
        </div>
      </div>
      <style>{`
        .vs--16 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #1a1a1a; }
        .vs--16 .vs__video-wrap { position: relative; padding-bottom: 50%; }
        .vs--16 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--16 .vs__bar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; color: #fff; }
        .vs--16 .vs__info { display: flex; align-items: center; gap: 2rem; }
        .vs--16 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.5); letter-spacing: 0.1em; }
        .vs--16 h3 { font-size: 1.1rem; font-weight: 600; margin: 0; text-transform: uppercase; }
        .vs--16 .vs__arrows { display: flex; gap: 0.5rem; }
        .vs--16 .vs__arrows button { background: rgba(255,255,255,0.1); border: none; color: #fff; width: 44px; height: 44px; cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; }
        .vs--16 .vs__arrows button:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// ============================================
// V17: NUMBERED LIST - Prominent numbering
// ============================================
function VideoSlider17({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--17">
      <div className="vs__list">
        {videos.map((v, i) => (
          <div key={i} className={`vs__item ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)}>
            <span className="vs__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="vs__name">{v.title}</span>
          </div>
        ))}
      </div>
      <div className="vs__main">
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
      </div>
      <style>{`
        .vs--17 { font-family: 'Space Grotesk', -apple-system, sans-serif; display: grid; grid-template-columns: 1fr 2fr; max-width: 1200px; margin: 0 auto; background: #fff; }
        .vs--17 .vs__list { background: #faf9f6; padding: 2rem; }
        .vs--17 .vs__item { display: flex; align-items: baseline; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid #e8e6e2; cursor: pointer; transition: all 0.3s ease; }
        .vs--17 .vs__item:hover { padding-left: 0.5rem; }
        .vs--17 .vs__item.active { padding-left: 1rem; border-left: 2px solid #1a1a1a; margin-left: -2rem; padding-left: calc(2rem + 1rem - 2px); }
        .vs--17 .vs__num { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: 700; color: #e8e6e2; }
        .vs--17 .vs__item.active .vs__num { color: #1a1a1a; }
        .vs--17 .vs__name { font-size: 0.9rem; font-weight: 500; color: #666; text-transform: uppercase; }
        .vs--17 .vs__item.active .vs__name { color: #1a1a1a; }
        .vs--17 .vs__main { display: flex; align-items: center; padding: 2rem; background: #1a1a1a; }
        .vs--17 .vs__video-wrap { width: 100%; position: relative; padding-bottom: 56.25%; border-radius: 4px; overflow: hidden; }
        .vs--17 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
      `}</style>
    </div>
  );
}

// ============================================
// V18: COMPACT - Space efficient
// ============================================
function VideoSlider18({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--18">
      <div className="vs__header">
        <span className="vs__label">Expedition Films</span>
        <span className="vs__counter">{currentIndex + 1}/{videos.length}</span>
      </div>
      <div className="vs__video-wrap">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        <button className="vs__prev" onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>←</button>
        <button className="vs__next" onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>→</button>
      </div>
      <h3>{video.title}</h3>
      <style>{`
        .vs--18 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #fff; padding: 2rem; max-width: 700px; margin: 0 auto; }
        .vs--18 .vs__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .vs--18 .vs__label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
        .vs--18 .vs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #666; }
        .vs--18 .vs__video-wrap { position: relative; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; }
        .vs--18 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--18 .vs__prev, .vs--18 .vs__next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1rem; z-index: 2; transition: all 0.3s ease; }
        .vs--18 .vs__prev { left: 1rem; }
        .vs--18 .vs__next { right: 1rem; }
        .vs--18 .vs__prev:hover, .vs--18 .vs__next:hover { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .vs--18 h3 { font-size: 1rem; font-weight: 600; color: #1a1a1a; margin: 1rem 0 0; text-transform: uppercase; text-align: center; }
      `}</style>
    </div>
  );
}

// ============================================
// V19: CINEMATIC - Widescreen bars
// ============================================
function VideoSlider19({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--19">
      <div className="vs__cinema">
        <div className="vs__bar-top" />
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__bar-bottom" />
      </div>
      <div className="vs__info">
        <h3>{video.title}</h3>
        <div className="vs__nav">
          {videos.map((_, i) => (
            <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)}>{String(i + 1).padStart(2, '0')}</button>
          ))}
        </div>
      </div>
      <style>{`
        .vs--19 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #0a0a0a; padding: 2rem; }
        .vs--19 .vs__cinema { max-width: 1000px; margin: 0 auto; }
        .vs--19 .vs__bar-top, .vs--19 .vs__bar-bottom { height: 40px; background: #000; }
        .vs--19 .vs__video-wrap { position: relative; padding-bottom: 42%; }
        .vs--19 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--19 .vs__info { max-width: 1000px; margin: 2rem auto 0; display: flex; justify-content: space-between; align-items: center; color: #fff; }
        .vs--19 h3 { font-size: 1.1rem; font-weight: 600; margin: 0; text-transform: uppercase; }
        .vs--19 .vs__nav { display: flex; gap: 0.25rem; }
        .vs--19 .vs__nav button { background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.5); padding: 0.5rem 0.75rem; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; cursor: pointer; transition: all 0.3s ease; }
        .vs--19 .vs__nav button.active { background: #fff; color: #000; }
      `}</style>
    </div>
  );
}

// ============================================
// V20: EXPEDITION MANIFEST - Technical aviation
// ============================================
function VideoSlider20({ currentIndex, setCurrentIndex }) {
  const video = videos[currentIndex];
  const videoId = getYouTubeID(video.videoUrl);
  return (
    <div className="vs vs--20">
      <div className="vs__manifest">
        <div className="vs__header">
          <span className="vs__code">HQ-EXP-{String(currentIndex + 1).padStart(3, '0')}</span>
          <span className="vs__label">Expedition Manifest</span>
        </div>
        <div className="vs__video-wrap">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} />
        </div>
        <div className="vs__data">
          <div className="vs__row">
            <span className="vs__key">Mission</span>
            <span className="vs__val">{video.title}</span>
          </div>
          <div className="vs__row">
            <span className="vs__key">Status</span>
            <span className="vs__val">Documented</span>
          </div>
          <div className="vs__row">
            <span className="vs__key">Film</span>
            <span className="vs__val">{String(currentIndex + 1).padStart(2, '0')} of {String(videos.length).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="vs__controls">
          <button onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : videos.length - 1)}>← Previous</button>
          <button onClick={() => setCurrentIndex(i => i < videos.length - 1 ? i + 1 : 0)}>Next →</button>
        </div>
      </div>
      <style>{`
        .vs--20 { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; padding: 3rem 2rem; }
        .vs--20 .vs__manifest { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e8e6e2; }
        .vs--20 .vs__header { display: flex; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #e8e6e2; }
        .vs--20 .vs__code { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; }
        .vs--20 .vs__label { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
        .vs--20 .vs__video-wrap { position: relative; padding-bottom: 56.25%; }
        .vs--20 .vs__video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .vs--20 .vs__data { padding: 1rem 1.5rem; border-top: 1px solid #e8e6e2; }
        .vs--20 .vs__row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed #e8e6e2; }
        .vs--20 .vs__row:last-child { border-bottom: none; }
        .vs--20 .vs__key { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; }
        .vs--20 .vs__val { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
        .vs--20 .vs__controls { display: flex; border-top: 1px solid #e8e6e2; }
        .vs--20 .vs__controls button { flex: 1; background: none; border: none; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; }
        .vs--20 .vs__controls button:first-child { border-right: 1px solid #e8e6e2; }
        .vs--20 .vs__controls button:hover { background: #faf9f6; }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN PICKER COMPONENT
// ============================================
function VideoSliderPicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVariant, setActiveVariant] = useState(1);

  const variants = [
    { id: 1, name: 'Side by Side', component: VideoSlider1 },
    { id: 2, name: 'Stacked', component: VideoSlider2 },
    { id: 3, name: 'Dark Theme', component: VideoSlider3 },
    { id: 4, name: 'Split Screen', component: VideoSlider4 },
    { id: 5, name: 'Large Counter', component: VideoSlider5 },
    { id: 6, name: 'Minimal', component: VideoSlider6 },
    { id: 7, name: 'Tabs Navigation', component: VideoSlider7 },
    { id: 8, name: 'Bordered', component: VideoSlider8 },
    { id: 9, name: 'Thumbnail Grid', component: VideoSlider9 },
    { id: 10, name: 'Vertical List', component: VideoSlider10 },
    { id: 11, name: 'Coordinates', component: VideoSlider11 },
    { id: 12, name: 'Editorial', component: VideoSlider12 },
    { id: 13, name: 'Card Elevated', component: VideoSlider13 },
    { id: 14, name: 'Overlay Info', component: VideoSlider14 },
    { id: 15, name: 'Asymmetric', component: VideoSlider15 },
    { id: 16, name: 'Full Width', component: VideoSlider16 },
    { id: 17, name: 'Numbered List', component: VideoSlider17 },
    { id: 18, name: 'Compact', component: VideoSlider18 },
    { id: 19, name: 'Cinematic', component: VideoSlider19 },
    { id: 20, name: 'Expedition Manifest', component: VideoSlider20 },
  ];

  const ActiveComponent = variants.find(v => v.id === activeVariant)?.component || VideoSlider1;

  return (
    <div className="vsp">
      <div className="vsp__header">
        <span className="vsp__pre">Component Library</span>
        <h1>Video Slider Picker</h1>
        <p>20 Variations • HQ Aviation Brand System</p>
      </div>

      <div className="vsp__tabs">
        {variants.map(v => (
          <button
            key={v.id}
            className={v.id === activeVariant ? 'active' : ''}
            onClick={() => { setActiveVariant(v.id); setCurrentIndex(0); }}
          >
            {String(v.id).padStart(2, '0')} {v.name}
          </button>
        ))}
      </div>

      <div className="vsp__preview">
        <ActiveComponent currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      </div>

      <style>{`
        .vsp { font-family: 'Space Grotesk', -apple-system, sans-serif; min-height: 100vh; background: #faf9f6; }
        .vsp__header { text-align: center; padding: 4rem 2rem 3rem; background: #1a1a1a; color: #fff; }
        .vsp__pre { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .vsp__header h1 { font-size: 2rem; font-weight: 700; margin: 0.5rem 0; text-transform: uppercase; }
        .vsp__header p { font-size: 0.85rem; margin: 0; color: rgba(255,255,255,0.6); }
        .vsp__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 1.5rem 2rem; background: #fff; border-bottom: 1px solid #e8e6e2; justify-content: center; }
        .vsp__tabs button { padding: 0.5rem 1rem; background: #faf9f6; border: 1px solid #e8e6e2; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; cursor: pointer; transition: all 0.3s ease; }
        .vsp__tabs button:hover { background: #e8e6e2; }
        .vsp__tabs button.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .vsp__preview { padding: 3rem 0; }
      `}</style>
    </div>
  );
}

export default VideoSliderPicker;

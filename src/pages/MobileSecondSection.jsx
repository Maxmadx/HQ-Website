import React, { useState, useRef, useEffect } from 'react';

/* ─── Shared data ─── */
const IMAGES = [
  { src: '/assets/images/facility/hq-0345.jpg', alt: 'The clubhouse lounge' },
  { src: '/assets/images/facility/hq-0354.jpg', alt: 'Globe on the clubhouse desk' },
  { src: '/assets/images/facility/hq-0053.jpg', alt: 'Helmet light and framed photos' },
  { src: '/assets/images/facility/hq-0391.jpg', alt: 'Captain Q expedition photo on the wall' },
  { src: '/assets/images/facility/hq-0477.jpg', alt: 'Helicopter compass instrument' },
  { src: '/assets/images/facility/hq-0300.jpg', alt: 'R66 Turbine cockpit instruments' },
  { src: '/assets/images/facility/hq-0388.jpg', alt: "Air Pilot's Manual on vintage trunk" },
  { src: '/assets/images/facility/hq-0696.jpg', alt: 'Captain Q flying' },
  { src: '/assets/images/facility/hq-0153-3.jpg', alt: 'Helicopters on the airfield' },
];

const PHASE1 = {
  pretitle: 'Denham Aerodrome',
  title: 'The Clubhouse',
  desc1: 'More than a flight school — a place to belong. Leather sofas, expedition memorabilia, and the quiet hum of rotors outside.',
  desc2: 'This is where pilots debrief over coffee, swap stories, and plan their next adventure.',
  gridItems: [
    { title: 'HQ Club', desc: 'You will be joining our groups, sharing helicopters, networking with entrepreneurs and high agency types seeking a new adventure that stands out from other private members clubs.', hero: true },
    { title: '7 Days a Week', desc: 'Operations team on site every day of the week.' },
    { title: 'Social Events', desc: 'Car races, go-karting, clay pigeon shooting.' },
  ],
  tagline: 'Friendly. Relaxed. Welcoming.',
};

const PHASE2 = {
  title: 'Escape to the Country',
  desc: 'Located just inside the M25 on the Buckinghamshire / Greater London border, Denham is uniquely positioned — close enough to the city to be practical, far enough to feel like a different world. Rolling countryside, open skies, and one of England\'s most charming aerodromes. Your helicopter is the gateway to all the destinations the UK has to offer.',
  stats: [
    { value: '25 min', label: 'From Central London' },
    { value: 'M25', label: 'Just Inside the Orbital' },
  ],
};


/* ═══════════════════════════════════════════════
   V1: Stacked Sections — No transition, both phases
   shown sequentially. Carousel between them.
   ═══════════════════════════════════════════════ */
function V1() {
  return (
    <div className="mv mv1">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>
      <h3 className="mv__title">{PHASE1.title}</h3>
      <p className="mv__desc">{PHASE1.desc1}</p>

      <div className="mv__carousel">
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <p className="mv__desc">{PHASE1.desc2}</p>

      <div className="mv__grid">
        {PHASE1.gridItems.map((item, i) => (
          <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
            <h4 className="mv__grid-title">{item.title}</h4>
            <p className="mv__grid-desc">{item.desc}</p>
          </div>
        ))}
      </div>
      <span className="mv__tagline">{PHASE1.tagline}</span>

      <div className="mv1__divider" />

      <h3 className="mv__title">{PHASE2.title}</h3>
      <p className="mv__desc">{PHASE2.desc}</p>
      <div className="mv__map-card">
        <div className="mv__map-card-top">
          <img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" />
        </div>
        <div className="mv__map-card-bottom">
          {PHASE2.stats.map((s, i) => (
            <div className="mv__stat" key={i}>
              <h4 className="mv__grid-title">{s.value}</h4>
              <p className="mv__grid-desc">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V2: Full-bleed hero image, text overlay at bottom.
   Scroll reveals phase 2 below.
   ═══════════════════════════════════════════════ */
function V2() {
  return (
    <div className="mv mv2">
      <div className="mv2__hero">
        <img src={IMAGES[0].src} alt={IMAGES[0].alt} />
        <div className="mv2__hero-overlay">
          <span className="mv__pretitle" style={{ color: '#ccc' }}>{PHASE1.pretitle}</span>
          <h3 className="mv__title" style={{ color: '#fff' }}>{PHASE1.title}</h3>
        </div>
      </div>
      <div className="mv2__body">
        <p className="mv__desc">{PHASE1.desc1}</p>
        <div className="mv__carousel">
          {IMAGES.slice(1, 6).map((img, i) => (
            <div className="mv__carousel-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
        <p className="mv__desc">{PHASE1.desc2}</p>
        <div className="mv__grid">
          {PHASE1.gridItems.map((item, i) => (
            <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
              <h4 className="mv__grid-title">{item.title}</h4>
              <p className="mv__grid-desc">{item.desc}</p>
            </div>
          ))}
        </div>
        <span className="mv__tagline">{PHASE1.tagline}</span>

        <div className="mv1__divider" />
        <h3 className="mv__title">{PHASE2.title}</h3>
        <p className="mv__desc">{PHASE2.desc}</p>
        <div className="mv__map-card">
          <div className="mv__map-card-top">
            <img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" />
          </div>
          <div className="mv__map-card-bottom">
            {PHASE2.stats.map((s, i) => (
              <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V3: Tabs — Tap between "The Clubhouse" / "Escape"
   with carousel always visible above.
   ═══════════════════════════════════════════════ */
function V3() {
  const [tab, setTab] = useState(0);
  return (
    <div className="mv mv3">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      <div className="mv__carousel">
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mv3__tabs">
        <button className={`mv3__tab ${tab === 0 ? 'mv3__tab--active' : ''}`} onClick={() => setTab(0)}>The Clubhouse</button>
        <button className={`mv3__tab ${tab === 1 ? 'mv3__tab--active' : ''}`} onClick={() => setTab(1)}>Escape to the Country</button>
      </div>

      {tab === 0 ? (
        <div className="mv3__panel">
          <p className="mv__desc">{PHASE1.desc1}</p>
          <p className="mv__desc">{PHASE1.desc2}</p>
          <div className="mv__grid">
            {PHASE1.gridItems.map((item, i) => (
              <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                <h4 className="mv__grid-title">{item.title}</h4>
                <p className="mv__grid-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <span className="mv__tagline">{PHASE1.tagline}</span>
        </div>
      ) : (
        <div className="mv3__panel">
          <p className="mv__desc">{PHASE2.desc}</p>
          <div className="mv__map-card">
            <div className="mv__map-card-top">
              <img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" />
            </div>
            <div className="mv__map-card-bottom">
              {PHASE2.stats.map((s, i) => (
                <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V4: Accordion — Each phase is a collapsible section.
   Carousel sits at the top.
   ═══════════════════════════════════════════════ */
function V4() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mv mv4">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      <div className="mv__carousel">
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mv4__accordion">
        <button className={`mv4__header ${open === 0 ? 'mv4__header--open' : ''}`} onClick={() => setOpen(open === 0 ? -1 : 0)}>
          <span>{PHASE1.title}</span>
          <span className="mv4__chevron">{open === 0 ? '−' : '+'}</span>
        </button>
        {open === 0 && (
          <div className="mv4__body">
            <p className="mv__desc">{PHASE1.desc1}</p>
            <p className="mv__desc">{PHASE1.desc2}</p>
            <div className="mv__grid">
              {PHASE1.gridItems.map((item, i) => (
                <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                  <h4 className="mv__grid-title">{item.title}</h4>
                  <p className="mv__grid-desc">{item.desc}</p>
                </div>
              ))}
            </div>
            <span className="mv__tagline">{PHASE1.tagline}</span>
          </div>
        )}

        <button className={`mv4__header ${open === 1 ? 'mv4__header--open' : ''}`} onClick={() => setOpen(open === 1 ? -1 : 1)}>
          <span>{PHASE2.title}</span>
          <span className="mv4__chevron">{open === 1 ? '−' : '+'}</span>
        </button>
        {open === 1 && (
          <div className="mv4__body">
            <p className="mv__desc">{PHASE2.desc}</p>
            <div className="mv__map-card">
              <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
              <div className="mv__map-card-bottom">
                {PHASE2.stats.map((s, i) => (
                  <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V5: Image-text interleave — alternating image
   cards and text blocks, single column flow.
   ═══════════════════════════════════════════════ */
function V5() {
  return (
    <div className="mv mv5">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>
      <h3 className="mv__title">{PHASE1.title}</h3>
      <p className="mv__desc">{PHASE1.desc1}</p>

      <div className="mv5__img-block">
        <img src={IMAGES[0].src} alt={IMAGES[0].alt} loading="lazy" />
      </div>

      <p className="mv__desc">{PHASE1.desc2}</p>

      <div className="mv5__img-row">
        <img src={IMAGES[1].src} alt={IMAGES[1].alt} loading="lazy" />
        <img src={IMAGES[2].src} alt={IMAGES[2].alt} loading="lazy" />
      </div>

      <div className="mv__grid">
        {PHASE1.gridItems.map((item, i) => (
          <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
            <h4 className="mv__grid-title">{item.title}</h4>
            <p className="mv__grid-desc">{item.desc}</p>
          </div>
        ))}
      </div>
      <span className="mv__tagline">{PHASE1.tagline}</span>

      <div className="mv5__img-block">
        <img src={IMAGES[3].src} alt={IMAGES[3].alt} loading="lazy" />
      </div>

      <h3 className="mv__title" style={{ marginTop: '2rem' }}>{PHASE2.title}</h3>
      <p className="mv__desc">{PHASE2.desc}</p>

      <div className="mv5__img-row">
        <img src={IMAGES[5].src} alt={IMAGES[5].alt} loading="lazy" />
        <img src={IMAGES[6].src} alt={IMAGES[6].alt} loading="lazy" />
      </div>

      <div className="mv__map-card">
        <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
        <div className="mv__map-card-bottom">
          {PHASE2.stats.map((s, i) => (
            <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V6: Card stack — Phase 1 & 2 as distinct cards
   with subtle shadows. Carousel above both.
   ═══════════════════════════════════════════════ */
function V6() {
  return (
    <div className="mv mv6">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      <div className="mv__carousel">
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mv6__card">
        <h3 className="mv__title">{PHASE1.title}</h3>
        <p className="mv__desc">{PHASE1.desc1}</p>
        <p className="mv__desc">{PHASE1.desc2}</p>
        <div className="mv__grid">
          {PHASE1.gridItems.map((item, i) => (
            <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
              <h4 className="mv__grid-title">{item.title}</h4>
              <p className="mv__grid-desc">{item.desc}</p>
            </div>
          ))}
        </div>
        <span className="mv__tagline">{PHASE1.tagline}</span>
      </div>

      <div className="mv6__card">
        <h3 className="mv__title">{PHASE2.title}</h3>
        <p className="mv__desc">{PHASE2.desc}</p>
        <div className="mv__map-card">
          <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
          <div className="mv__map-card-bottom">
            {PHASE2.stats.map((s, i) => (
              <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V7: Swipeable horizontal pages — full-width
   snap scroll between Phase 1 and Phase 2.
   Carousel above.
   ═══════════════════════════════════════════════ */
function V7() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPage(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mv mv7">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      <div className="mv__carousel">
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mv7__dots">
        <span className={`mv7__dot ${page === 0 ? 'mv7__dot--active' : ''}`} />
        <span className={`mv7__dot ${page === 1 ? 'mv7__dot--active' : ''}`} />
      </div>

      <div className="mv7__pages" ref={scrollRef}>
        <div className="mv7__page">
          <h3 className="mv__title">{PHASE1.title}</h3>
          <p className="mv__desc">{PHASE1.desc1}</p>
          <p className="mv__desc">{PHASE1.desc2}</p>
          <div className="mv__grid">
            {PHASE1.gridItems.map((item, i) => (
              <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                <h4 className="mv__grid-title">{item.title}</h4>
                <p className="mv__grid-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <span className="mv__tagline">{PHASE1.tagline}</span>
        </div>

        <div className="mv7__page">
          <h3 className="mv__title">{PHASE2.title}</h3>
          <p className="mv__desc">{PHASE2.desc}</p>
          <div className="mv__map-card">
            <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
            <div className="mv__map-card-bottom">
              {PHASE2.stats.map((s, i) => (
                <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V8: Parallax-lite — Large background image with
   text overlaid, then Phase 2 stacked below.
   ═══════════════════════════════════════════════ */
function V8() {
  return (
    <div className="mv mv8">
      <div className="mv8__hero">
        <img src={IMAGES[0].src} alt={IMAGES[0].alt} />
        <div className="mv8__hero-content">
          <span className="mv__pretitle" style={{ color: 'rgba(255,255,255,0.7)' }}>{PHASE1.pretitle}</span>
          <h3 className="mv__title" style={{ color: '#fff', fontSize: '1.8rem' }}>{PHASE1.title}</h3>
          <p className="mv__desc" style={{ color: 'rgba(255,255,255,0.85)' }}>{PHASE1.desc1}</p>
        </div>
      </div>

      <div className="mv8__body">
        <p className="mv__desc">{PHASE1.desc2}</p>

        <div className="mv__carousel">
          {IMAGES.slice(1).map((img, i) => (
            <div className="mv__carousel-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="mv__grid">
          {PHASE1.gridItems.map((item, i) => (
            <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
              <h4 className="mv__grid-title">{item.title}</h4>
              <p className="mv__grid-desc">{item.desc}</p>
            </div>
          ))}
        </div>
        <span className="mv__tagline">{PHASE1.tagline}</span>

        <div className="mv1__divider" />

        <h3 className="mv__title">{PHASE2.title}</h3>
        <p className="mv__desc">{PHASE2.desc}</p>
        <div className="mv__map-card">
          <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
          <div className="mv__map-card-bottom">
            {PHASE2.stats.map((s, i) => (
              <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V9: Scroll-reveal — Both phases stacked, but
   Phase 2 fades in on scroll intersection.
   Carousel auto-scrolls as you scroll the page.
   ═══════════════════════════════════════════════ */
function V9() {
  const phase2Ref = useRef(null);
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const [phase2Visible, setPhase2Visible] = useState(false);

  useEffect(() => {
    const el = phase2Ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPhase2Visible(true);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const carousel = carouselRef.current;
        if (!section || !carousel) return;
        const rect = section.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / section.offsetHeight));
        const max = carousel.scrollWidth - carousel.clientWidth;
        if (max > 0) carousel.scrollLeft = progress * max;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="mv mv9" ref={sectionRef}>
      <span className="mv__pretitle">{PHASE1.pretitle}</span>
      <h3 className="mv__title">{PHASE1.title}</h3>
      <p className="mv__desc">{PHASE1.desc1}</p>

      <div className="mv__carousel" ref={carouselRef}>
        {IMAGES.map((img, i) => (
          <div className="mv__carousel-item" key={i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <p className="mv__desc">{PHASE1.desc2}</p>

      <div className="mv__grid">
        {PHASE1.gridItems.map((item, i) => (
          <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
            <h4 className="mv__grid-title">{item.title}</h4>
            <p className="mv__grid-desc">{item.desc}</p>
          </div>
        ))}
      </div>
      <span className="mv__tagline">{PHASE1.tagline}</span>

      <div
        ref={phase2Ref}
        className="mv9__phase2"
        style={{ opacity: phase2Visible ? 1 : 0, transform: phase2Visible ? 'translateY(0)' : 'translateY(30px)' }}
      >
        <div className="mv1__divider" />
        <h3 className="mv__title">{PHASE2.title}</h3>
        <p className="mv__desc">{PHASE2.desc}</p>
        <div className="mv__map-card">
          <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
          <div className="mv__map-card-bottom">
            {PHASE2.stats.map((s, i) => (
              <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V10: Compact magazine — Large hero image, compact
   text, two-column stat pills, carousel at bottom.
   Everything visible without scroll interaction.
   ═══════════════════════════════════════════════ */
function V10() {
  return (
    <div className="mv mv10">
      <div className="mv10__hero">
        <img src={IMAGES[0].src} alt={IMAGES[0].alt} />
      </div>

      <div className="mv10__body">
        <span className="mv__pretitle">{PHASE1.pretitle}</span>
        <h3 className="mv__title" style={{ fontSize: '1.6rem' }}>{PHASE1.title}</h3>
        <p className="mv__desc">{PHASE1.desc1}</p>

        <div className="mv10__pills">
          {PHASE1.gridItems.map((item, i) => (
            <div className="mv10__pill" key={i}>
              <strong>{item.title}</strong>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>

        <span className="mv__tagline">{PHASE1.tagline}</span>

        <div className="mv__carousel" style={{ marginTop: '1.5rem' }}>
          {IMAGES.slice(1).map((img, i) => (
            <div className="mv__carousel-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="mv1__divider" />

        <h3 className="mv__title" style={{ fontSize: '1.6rem' }}>{PHASE2.title}</h3>
        <p className="mv__desc">{PHASE2.desc}</p>

        <div className="mv10__stats-row">
          {PHASE2.stats.map((s, i) => (
            <div className="mv10__stat-badge" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mv__map-card" style={{ marginTop: '1rem' }}>
          <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V11: Swipeable pages (no carousel) — Images are
   embedded inline within each page. Phase 1 gets a
   hero image + 2-up row. Phase 2 gets an image
   behind the title + the map.
   ═══════════════════════════════════════════════ */
function V11() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPage(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mv mv11">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      <div className="mv7__dots">
        <span className={`mv7__dot ${page === 0 ? 'mv7__dot--active' : ''}`} />
        <span className={`mv7__dot ${page === 1 ? 'mv7__dot--active' : ''}`} />
      </div>

      <div className="mv7__pages" ref={scrollRef}>
        {/* Page 1: The Clubhouse */}
        <div className="mv7__page">
          <div className="mv11__hero-img">
            <img src={IMAGES[0].src} alt={IMAGES[0].alt} loading="lazy" />
          </div>

          <h3 className="mv__title">{PHASE1.title}</h3>
          <p className="mv__desc">{PHASE1.desc1}</p>

          <div className="mv11__img-row">
            <img src={IMAGES[1].src} alt={IMAGES[1].alt} loading="lazy" />
            <img src={IMAGES[2].src} alt={IMAGES[2].alt} loading="lazy" />
          </div>

          <p className="mv__desc">{PHASE1.desc2}</p>

          <div className="mv__grid">
            {PHASE1.gridItems.map((item, i) => (
              <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                <h4 className="mv__grid-title">{item.title}</h4>
                <p className="mv__grid-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <span className="mv__tagline">{PHASE1.tagline}</span>

          <div className="mv11__img-row" style={{ marginTop: '1.25rem' }}>
            <img src={IMAGES[4].src} alt={IMAGES[4].alt} loading="lazy" />
            <img src={IMAGES[5].src} alt={IMAGES[5].alt} loading="lazy" />
          </div>
        </div>

        {/* Page 2: Escape to the Country */}
        <div className="mv7__page">
          <div className="mv11__hero-img">
            <img src={IMAGES[8].src} alt={IMAGES[8].alt} loading="lazy" />
          </div>

          <h3 className="mv__title">{PHASE2.title}</h3>
          <p className="mv__desc">{PHASE2.desc}</p>

          <div className="mv11__img-row">
            <img src={IMAGES[6].src} alt={IMAGES[6].alt} loading="lazy" />
            <img src={IMAGES[7].src} alt={IMAGES[7].alt} loading="lazy" />
          </div>

          <div className="mv__map-card">
            <div className="mv__map-card-top">
              <img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" />
            </div>
            <div className="mv__map-card-bottom">
              {PHASE2.stats.map((s, i) => (
                <div className="mv__stat" key={i}>
                  <h4 className="mv__grid-title">{s.value}</h4>
                  <p className="mv__grid-desc">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V12: Swipeable pages with title overlay on carousel.
   Based on V7 but the phase title sits on top of the
   image carousel with a gradient, swapping on swipe.
   ═══════════════════════════════════════════════ */
function V12() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPage(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mv mv12">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      {/* Carousel with title overlay */}
      <div className="mv12__carousel-wrap">
        <div className="mv__carousel">
          {IMAGES.map((img, i) => (
            <div className="mv__carousel-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mv12__overlay">
          <h3 className="mv12__overlay-title" style={{ opacity: 1 - page, transform: `translateY(${page * -8}px)` }}>
            {PHASE1.title}
          </h3>
          <h3 className="mv12__overlay-title" style={{ opacity: page, transform: `translateY(${(1 - page) * 8}px)` }}>
            {PHASE2.title}
          </h3>
        </div>
      </div>

      <div className="mv7__dots">
        <span className={`mv7__dot ${page === 0 ? 'mv7__dot--active' : ''}`} />
        <span className={`mv7__dot ${page === 1 ? 'mv7__dot--active' : ''}`} />
      </div>

      <div className="mv7__pages" ref={scrollRef}>
        <div className="mv7__page">
          <p className="mv__desc">{PHASE1.desc1}</p>
          <p className="mv__desc">{PHASE1.desc2}</p>
          <div className="mv__grid">
            {PHASE1.gridItems.map((item, i) => (
              <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                <h4 className="mv__grid-title">{item.title}</h4>
                <p className="mv__grid-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <span className="mv__tagline">{PHASE1.tagline}</span>
        </div>

        <div className="mv7__page">
          <p className="mv__desc">{PHASE2.desc}</p>
          <div className="mv__map-card">
            <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
            <div className="mv__map-card-bottom">
              {PHASE2.stats.map((s, i) => (
                <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V13: Same as V12 but with a visible horizontal
   progress bar on the carousel.
   ═══════════════════════════════════════════════ */
function V13() {
  const [page, setPage] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const scrollRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPage(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCarouselProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mv mv13">
      <span className="mv__pretitle">{PHASE1.pretitle}</span>

      {/* Carousel with title overlay + scrollbar */}
      <div className="mv12__carousel-wrap">
        <div className="mv__carousel mv13__carousel" ref={carouselRef}>
          {IMAGES.map((img, i) => (
            <div className="mv__carousel-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mv12__overlay">
          <h3 className="mv12__overlay-title" style={{ opacity: 1 - page, transform: `translateY(${page * -8}px)` }}>
            {PHASE1.title}
          </h3>
          <h3 className="mv12__overlay-title" style={{ opacity: page, transform: `translateY(${(1 - page) * 8}px)` }}>
            {PHASE2.title}
          </h3>
        </div>
        {/* Progress bar */}
        <div className="mv13__scrollbar-track">
          <div className="mv13__scrollbar-thumb" style={{ width: '30%', transform: `translateX(${carouselProgress * 233}%)` }} />
        </div>
      </div>

      <div className="mv7__dots">
        <span className={`mv7__dot ${page === 0 ? 'mv7__dot--active' : ''}`} />
        <span className={`mv7__dot ${page === 1 ? 'mv7__dot--active' : ''}`} />
      </div>

      <div className="mv7__pages" ref={scrollRef}>
        <div className="mv7__page">
          <p className="mv__desc">{PHASE1.desc1}</p>
          <p className="mv__desc">{PHASE1.desc2}</p>
          <div className="mv__grid">
            {PHASE1.gridItems.map((item, i) => (
              <div className={`mv__grid-item ${item.hero ? 'mv__grid-item--hero' : ''}`} key={i}>
                <h4 className="mv__grid-title">{item.title}</h4>
                <p className="mv__grid-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <span className="mv__tagline">{PHASE1.tagline}</span>
        </div>

        <div className="mv7__page">
          <p className="mv__desc">{PHASE2.desc}</p>
          <div className="mv__map-card">
            <div className="mv__map-card-top"><img src="/assets/images/maps/map-of-hq.png" alt="Map of HQ" loading="lazy" /></div>
            <div className="mv__map-card-bottom">
              {PHASE2.stats.map((s, i) => (
                <div className="mv__stat" key={i}><h4 className="mv__grid-title">{s.value}</h4><p className="mv__grid-desc">{s.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   Variations list
   ═══════════════════════════════════════════════ */
const VARIATIONS = [
  { id: 1, name: 'Stacked Sections', desc: 'Both phases shown sequentially. Carousel between description paragraphs. No transitions.', Component: V1 },
  { id: 2, name: 'Full-Bleed Hero', desc: 'Large hero image with title overlay. Content flows below with inline carousel.', Component: V2 },
  { id: 3, name: 'Tabbed Phases', desc: 'Carousel always visible. Tap tabs to switch between Clubhouse and Escape content.', Component: V3 },
  { id: 4, name: 'Accordion', desc: 'Carousel at top, collapsible sections for each phase. Only one open at a time.', Component: V4 },
  { id: 5, name: 'Image-Text Interleave', desc: 'Alternating full-width images and text blocks. Magazine editorial feel.', Component: V5 },
  { id: 6, name: 'Card Stack', desc: 'Carousel at top, each phase in its own elevated card with shadow.', Component: V6 },
  { id: 7, name: 'Swipeable Pages', desc: 'Horizontal full-width snap-scroll between Phase 1 and Phase 2. Dots indicator.', Component: V7 },
  { id: 8, name: 'Parallax-Lite', desc: 'Dark hero with overlaid text, then standard content below. Cinematic feel.', Component: V8 },
  { id: 9, name: 'Scroll-Reveal', desc: 'Phase 1 visible immediately. Phase 2 fades in on scroll. Carousel auto-scrolls with page.', Component: V9 },
  { id: 10, name: 'Compact Magazine', desc: 'Hero image, compact pill-style grid items, stats badges. Dense, editorial layout.', Component: V10 },
  { id: 11, name: 'Swipeable (No Carousel)', desc: 'V7 swipeable pages but images are embedded inline within each page — no separate carousel strip.', Component: V11 },
  { id: 12, name: 'Swipeable + Title Overlay', desc: 'V7 swipeable pages with phase titles overlaid on the carousel. Title crossfades as you swipe between pages.', Component: V12 },
  { id: 13, name: 'Title Overlay + Scrollbar', desc: 'V12 with a visible horizontal progress bar on the carousel showing scroll position.', Component: V13 },
];


/* ═══════════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════════ */
function MobileSecondSection() {
  const [activeId, setActiveId] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <div className="mssp">
        <div className="mssp__header">
          <h1 className="mssp__h1">Mobile Clubhouse Section</h1>
          <p className="mssp__subtitle">13 variations — view on a mobile viewport (375px)</p>
        </div>

        <div className="mssp__picker">
          {VARIATIONS.map(v => (
            <button
              key={v.id}
              className={`mssp__pick ${activeId === v.id ? 'mssp__pick--active' : ''}`}
              onClick={() => {
                setActiveId(v.id);
                setTimeout(() => {
                  document.getElementById(`mv-${v.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            >
              <span className="mssp__pick-num">V{v.id}</span>
              <span className="mssp__pick-name">{v.name}</span>
            </button>
          ))}
        </div>

        <div className="mssp__variations">
          {VARIATIONS.filter(v => activeId === null || activeId === v.id).map(v => (
            <div key={v.id} id={`mv-${v.id}`} className="mssp__section">
              <div className="mssp__section-label">
                <span className="mssp__section-num">V{v.id}</span>
                <div>
                  <h2 className="mssp__section-title">{v.name}</h2>
                  <p className="mssp__section-desc">{v.desc}</p>
                </div>
              </div>
              <div className="mssp__phone">
                <div className="mssp__phone-screen">
                  <v.Component />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

  .mssp {
    font-family: 'Space Grotesk', sans-serif;
    background: #f5f4f1;
    min-height: 100vh;
    padding: 2rem 1rem;
  }
  .mssp__header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .mssp__h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
  }
  .mssp__subtitle {
    color: #888;
    font-size: 0.85rem;
    margin: 0;
  }

  /* Picker */
  .mssp__picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 2.5rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .mssp__pick {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    color: #555;
    transition: all 0.15s;
  }
  .mssp__pick:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }
  .mssp__pick--active {
    background: #1a1a1a;
    border-color: #1a1a1a;
    color: #fff;
  }
  .mssp__pick-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    opacity: 0.6;
  }
  .mssp__pick-name {
    font-weight: 500;
  }

  /* Section */
  .mssp__section {
    max-width: 500px;
    margin: 0 auto 4rem;
  }
  .mssp__section-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 1rem;
  }
  .mssp__section-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: #999;
    background: #eee;
    padding: 3px 8px;
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .mssp__section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 4px;
  }
  .mssp__section-desc {
    font-size: 0.78rem;
    color: #888;
    margin: 0;
    line-height: 1.4;
  }

  /* Phone frame */
  .mssp__phone {
    border: 2px solid #ddd;
    border-radius: 24px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .mssp__phone-screen {
    max-height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* ─── Shared variation styles ─── */
  .mv {
    font-family: 'Space Grotesk', sans-serif;
    background: #fff;
    padding: 2rem 1.25rem;
  }
  .mv__pretitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    display: block;
    margin-bottom: 0.5rem;
  }
  .mv__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }
  .mv__desc {
    font-size: 0.82rem;
    line-height: 1.7;
    color: #555;
    margin: 0 0 1.25rem;
  }
  .mv__tagline {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #999;
    border-top: 1px solid rgba(0,0,0,0.08);
    margin-top: 1.25rem;
    padding-top: 0.75rem;
    display: block;
  }

  /* Carousel */
  .mv__carousel {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 0 0.5rem;
    margin: 0 -1.25rem 1.25rem;
    padding-left: 1.25rem;
    scrollbar-width: none;
  }
  .mv__carousel::-webkit-scrollbar { display: none; }
  .mv__carousel-item {
    flex: 0 0 72%;
    scroll-snap-align: start;
    border-radius: 6px;
    overflow: hidden;
  }
  .mv__carousel-item:last-child { margin-right: 1.25rem; }
  .mv__carousel-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    filter: saturate(0.85);
  }

  /* Grid */
  .mv__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 1.25rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 8px;
    overflow: hidden;
  }
  .mv__grid-item {
    padding: 1rem;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    border-right: 1px solid rgba(0,0,0,0.08);
  }
  .mv__grid-item--hero {
    grid-column: 1 / -1;
    border-right: none;
    padding: 1.25rem;
    background: rgba(0,0,0,0.025);
  }
  .mv__grid-item:nth-child(2) { border-bottom: none; }
  .mv__grid-item:nth-child(3) { border-right: none; border-bottom: none; }
  .mv__grid-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #1a1a1a;
    margin: 0 0 0.25rem;
  }
  .mv__grid-desc {
    font-size: 0.72rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
  }

  /* Map card */
  .mv__map-card {
    margin-top: 1.25rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    overflow: hidden;
  }
  .mv__map-card-top {
    padding: 0.75rem;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }
  .mv__map-card-top img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 6px;
  }
  .mv__map-card-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .mv__stat {
    padding: 1rem;
  }
  .mv__stat:first-child {
    border-right: 1px solid rgba(0,0,0,0.08);
  }

  /* V1 divider */
  .mv1__divider {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin: 2rem 0;
  }

  /* V2 */
  .mv2__hero {
    position: relative;
    margin: -2rem -1.25rem 0;
    height: 260px;
    overflow: hidden;
  }
  .mv2__hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mv2__hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 1.25rem 1.25rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
  }
  .mv2__body { padding-top: 1.5rem; }

  /* V3 tabs */
  .mv3__tabs {
    display: flex;
    gap: 0;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .mv3__tab {
    flex: 1;
    padding: 10px 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border: none;
    background: #fff;
    color: #999;
    cursor: pointer;
    transition: all 0.15s;
  }
  .mv3__tab--active {
    background: #1a1a1a;
    color: #fff;
  }
  .mv3__tab + .mv3__tab { border-left: 1px solid rgba(0,0,0,0.1); }
  .mv3__panel { animation: mvFadeIn 0.2s ease; }

  /* V4 accordion */
  .mv4__accordion {
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1rem;
  }
  .mv4__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    background: #fff;
    cursor: pointer;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    color: #1a1a1a;
  }
  .mv4__header--open { background: rgba(0,0,0,0.02); }
  .mv4__chevron { font-size: 1.2rem; color: #999; }
  .mv4__body {
    padding: 1rem 1.25rem 1.5rem;
    animation: mvFadeIn 0.2s ease;
  }

  /* V5 interleave */
  .mv5__img-block {
    margin: 0 -1.25rem 1.25rem;
    overflow: hidden;
  }
  .mv5__img-block img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    filter: saturate(0.85);
  }
  .mv5__img-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 1.25rem;
  }
  .mv5__img-row img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 4px;
    filter: saturate(0.85);
  }

  /* V6 cards */
  .mv6__card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    padding: 1.5rem 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  /* V7 swipeable pages */
  .mv7__pages {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin: 0 -1.25rem;
  }
  .mv7__pages::-webkit-scrollbar { display: none; }
  .mv7__page {
    flex: 0 0 100%;
    scroll-snap-align: start;
    padding: 0 1.25rem;
    box-sizing: border-box;
  }
  .mv7__dots {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .mv7__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ddd;
    transition: background 0.2s;
  }
  .mv7__dot--active { background: #1a1a1a; }

  /* V8 parallax-lite */
  .mv8__hero {
    position: relative;
    margin: -2rem -1.25rem 0;
    height: 320px;
    overflow: hidden;
  }
  .mv8__hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6) saturate(0.8);
  }
  .mv8__hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 1.25rem;
  }
  .mv8__body { padding-top: 1.5rem; }

  /* V9 scroll-reveal */
  .mv9__phase2 {
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  /* V10 compact magazine */
  .mv10__hero {
    margin: -2rem -1.25rem 1.25rem;
    overflow: hidden;
  }
  .mv10__hero img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  .mv10__body { }
  .mv10__pills {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 1rem 0;
  }
  .mv10__pill {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    background: #faf9f6;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .mv10__pill strong {
    font-size: 0.78rem;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .mv10__pill span {
    font-size: 0.7rem;
    color: #666;
    line-height: 1.4;
  }
  .mv10__stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 1rem 0;
  }
  .mv10__stat-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 8px;
    text-align: center;
  }
  .mv10__stat-badge strong {
    font-size: 1rem;
    color: #1a1a1a;
  }
  .mv10__stat-badge span {
    font-size: 0.65rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* V12 — carousel with title overlay */
  .mv12__carousel-wrap {
    position: relative;
    margin-bottom: 1rem;
  }
  .mv12__carousel-wrap .mv__carousel {
    margin-bottom: 0;
  }
  .mv12__carousel-wrap .mv__carousel-item img {
    height: 240px;
    filter: saturate(0.8) brightness(0.7);
  }
  .mv12__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem 1.25rem 1rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    pointer-events: none;
  }
  .mv12__overlay-title {
    position: absolute;
    bottom: 1rem;
    left: 1.25rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: -0.02em;
    transition: opacity 0.2s, transform 0.2s;
    text-shadow: 0 1px 8px rgba(0,0,0,0.3);
  }

  /* V13 — carousel scrollbar */
  .mv13__carousel {
    scrollbar-width: none;
  }
  .mv13__carousel::-webkit-scrollbar { display: none; }
  .mv13__scrollbar-track {
    height: 3px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    margin: 8px 1.25rem 0;
    overflow: hidden;
  }
  .mv13__scrollbar-thumb {
    height: 100%;
    background: rgba(255,255,255,0.7);
    border-radius: 2px;
    transition: transform 0.05s linear;
  }

  /* V11 — inline images within swipeable pages */
  .mv11__hero-img {
    margin: 0 0 1.25rem;
    border-radius: 6px;
    overflow: hidden;
  }
  .mv11__hero-img img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    filter: saturate(0.85);
  }
  .mv11__img-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 1.25rem;
  }
  .mv11__img-row img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    display: block;
    border-radius: 4px;
    filter: saturate(0.85);
  }

  @keyframes mvFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default MobileSecondSection;

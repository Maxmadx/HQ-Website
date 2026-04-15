import { useState, useEffect, useRef } from 'react';

// Pricing configuration
const PRICING = {
  shared: {
    day: 199,
    sunset: 249,
    night: 299,
  },
  private: {
    day: 1495,
    sunset: 1695,
    night: 1895,
  },
};

function LondonTourTicket() {
  const [experience, setExperience] = useState('shared');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [quantity, setQuantity] = useState(1);
  const ticketRef = useRef(null);

  // Calculate price based on selections
  const calculatePrice = () => {
    if (experience === 'private') {
      return PRICING.private[timeOfDay];
    }
    return PRICING.shared[timeOfDay] * quantity;
  };

  // Handle quantity changes
  const changeQty = (delta) => {
    const maxPassengers = 4;
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= maxPassengers) {
      setQuantity(newQty);
    }
  };

  // Reset quantity when switching to private
  useEffect(() => {
    if (experience === 'private') {
      setQuantity(1);
    }
  }, [experience]);

  // 3D tilt effect on desktop
  useEffect(() => {
    const ticket = ticketRef.current;
    if (!ticket) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return;

      const rect = ticket.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 200;
      const rotateY = (centerX - x) / 200;

      ticket.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      ticket.style.transform = 'rotateX(0) rotateY(0)';
    };

    ticket.addEventListener('mousemove', handleMouseMove);
    ticket.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ticket.removeEventListener('mousemove', handleMouseMove);
      ticket.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const priceLabel = experience === 'private' ? 'Total Price' : 'Per Person';
  const qtyLegend = experience === 'private' ? 'Passengers (up to 4)' : 'Passengers';
  const maxQty = 4;

  return (
    <>
      <style>{`
        .london-ticket {
          --primary: #000;
          --accent: #b38728;
          --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --radius: 20px;
          --cut-size: 18px;

          font-family: var(--font-stack);
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1500px;
        }

        .london-ticket * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ticket-wrapper {
          max-width: 700px;
          width: 100%;
          display: flex;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          filter: drop-shadow(0 20px 35px rgba(0,0,0,0.12));
        }

        /* --- LEFT SECTION --- */
        .visual-section {
          flex: 1;
          background: radial-gradient(circle at 70% 30%, #2a2a2a 0%, #000 100%);
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          color: white;
          border-radius: var(--radius) 0 0 var(--radius);
          overflow: hidden;
          z-index: 1;
          min-height: 280px;

          -webkit-mask-image:
              radial-gradient(circle at top right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
              radial-gradient(circle at bottom right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
          -webkit-mask-size: 100% 51%;
          -webkit-mask-position: top, bottom;
          -webkit-mask-repeat: no-repeat;
          mask-image:
              radial-gradient(circle at top right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
              radial-gradient(circle at bottom right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
          mask-size: 100% 51%;
          mask-position: top, bottom;
          mask-repeat: no-repeat;
        }

        .visual-section::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-10deg);
          width: 140%;
          height: 140%;
          background-image: url('/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.06;
          pointer-events: none;
          z-index: -1;
        }

        .heli-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transform: translateZ(30px);
          width: 100%;
          height: 100%;
        }

        .heli-wrapper img {
          width: 110%;
          max-width: 350px;
          object-fit: contain;
          height: auto;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
          transform: translateX(-15px);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ticket-wrapper:hover .heli-wrapper img {
          transform: translateY(-15px) translateX(-15px) scale(1.02);
        }

        .location-header {
          position: absolute;
          bottom: 25px;
          left: 25px;
          width: calc(100% - 50px);
          z-index: 3;
          pointer-events: none;
        }

        .location-header h1 {
          font-size: 42px;
          font-weight: 900;
          line-height: 0.9;
          margin-bottom: 6px;
          background: linear-gradient(to bottom, #fff, #aaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .location-header p {
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-size: 10px;
          opacity: 0.8;
          font-weight: 600;
        }

        /* --- RIGHT SECTION --- */
        .details-section {
          flex: 1.3;
          background: #fff;
          padding: 20px;
          position: relative;
          border-radius: 0 var(--radius) var(--radius) 0;
          z-index: 2;
          transform-origin: left center;
          transition: transform 0.3s ease-out;
          display: flex;
          flex-direction: column;

          -webkit-mask-image:
              radial-gradient(circle at top left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
              radial-gradient(circle at bottom left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
          -webkit-mask-size: 100% 51%;
          -webkit-mask-position: top, bottom;
          -webkit-mask-repeat: no-repeat;
          mask-image:
              radial-gradient(circle at top left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
              radial-gradient(circle at bottom left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
          mask-size: 100% 51%;
          mask-position: top, bottom;
          mask-repeat: no-repeat;
        }

        .details-section:hover {
          transform: translateX(5px) rotate(0.3deg);
        }

        .perforation {
          position: absolute;
          left: -1px;
          top: var(--cut-size);
          bottom: var(--cut-size);
          border-left: 2px dashed #ccc;
          z-index: 10;
        }

        .airport-code {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 28px;
          font-weight: 900;
          color: #f0f0f0;
          letter-spacing: -1px;
          z-index: 0;
          pointer-events: none;
        }

        .tour-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
          color: #222;
        }

        .ticket-fieldset {
          border: none;
          margin-bottom: 10px;
        }

        .ticket-legend {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
          width: 100%;
        }

        .segmented-control {
          background: #f4f4f4;
          padding: 3px;
          border-radius: 10px;
          display: grid;
          gap: 3px;
        }

        .radio-grid {
          grid-template-columns: 1fr 1fr;
        }

        .radio-card input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-card label {
          display: block;
          padding: 8px;
          border: 2px solid transparent;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          opacity: 0.6;
        }

        .radio-card input:checked + label {
          background: #fff;
          color: #000;
          box-shadow: 0 3px 8px rgba(0,0,0,0.05);
          transform: scale(1.02);
          opacity: 1;
        }

        .card-title {
          display: block;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          margin-bottom: 1px;
        }

        .card-desc {
          display: block;
          font-size: 9px;
          font-weight: 500;
        }

        .time-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .time-option input {
          display: none;
        }

        .time-option label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          background: transparent;
          opacity: 0.6;
        }

        .time-option input:checked + label {
          opacity: 1;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .time-option input[value="day"]:checked + label {
          background: #fff;
          color: #2563eb;
          border-color: #2563eb;
        }

        .time-option input[value="sunset"]:checked + label {
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          color: white;
          border-color: transparent;
        }

        .time-option input[value="night"]:checked + label {
          background: #0b1026;
          color: white;
          border-color: transparent;
        }

        .stars {
          opacity: 0;
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .time-option input[value="night"]:checked + label .stars {
          opacity: 1;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 1.5s infinite ease-in-out;
        }

        .star:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
        .star:nth-child(2) { top: 70%; left: 80%; animation-delay: 0.5s; }
        .star:nth-child(3) { top: 40%; left: 50%; animation-delay: 1s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .controls-row {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .qty-control {
          display: flex;
          align-items: center;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          padding: 3px;
          background: #fff;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .qty-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .qty-display {
          width: 26px;
          text-align: center;
          font-weight: 800;
          font-size: 14px;
        }

        .features-list {
          list-style: none;
          margin-bottom: 8px;
          padding: 0;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
          font-size: 11px;
          color: #444;
          font-weight: 500;
        }

        .features-list li::before {
          content: '\\2713';
          font-weight: 900;
          color: #000;
          font-size: 12px;
        }

        .refund-notice {
          background: #f8f8f8;
          padding: 8px 10px;
          border-radius: 5px;
          border-left: 3px solid #b38728;
          margin-bottom: auto;
          font-size: 9px;
          color: #666;
        }

        .refund-notice strong {
          color: #000;
        }

        .price-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 2px solid #eee;
          margin-top: 12px;
        }

        .price-block small {
          display: block;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          color: #999;
          letter-spacing: 1px;
          margin-bottom: 2px;
        }

        .price-value {
          font-size: 28px;
          font-weight: 900;
          color: #000;
          line-height: 1;
          letter-spacing: -1px;
        }

        .redeem-btn {
          background: #000;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .redeem-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .ticket-wrapper {
            flex-direction: column;
            transform: none !important;
            max-width: 400px;
          }

          .visual-section {
            padding: 0;
            border-radius: var(--radius) var(--radius) 0 0;
            min-height: 220px;
            justify-content: flex-start;

            -webkit-mask-image:
                radial-gradient(circle at bottom left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
                radial-gradient(circle at bottom right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
            -webkit-mask-position: bottom left, bottom right;
            -webkit-mask-size: 51% 100%;
            mask-image:
                radial-gradient(circle at bottom left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
                radial-gradient(circle at bottom right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
            mask-position: bottom left, bottom right;
            mask-size: 51% 100%;
          }

          .heli-wrapper img {
            transform: translateX(0);
            width: 100%;
            max-width: none;
          }

          .ticket-wrapper:hover .heli-wrapper img {
            transform: translateX(0);
          }

          .location-header {
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 100%;
            z-index: 5;
            text-align: center;
          }

          .location-header h1 {
            font-size: 36px;
          }

          .details-section {
            padding: 18px;
            border-radius: 0 0 var(--radius) var(--radius);
            transform: none !important;
            -webkit-mask-image:
                radial-gradient(circle at top left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
                radial-gradient(circle at top right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
            -webkit-mask-position: top left, top right;
            -webkit-mask-size: 51% 100%;
            mask-image:
                radial-gradient(circle at top left, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px)),
                radial-gradient(circle at top right, transparent var(--cut-size), black calc(var(--cut-size) + 0.5px));
            mask-position: top left, top right;
            mask-size: 51% 100%;
          }

          .details-section:hover {
            transform: none !important;
          }

          .perforation {
            top: 0;
            left: var(--cut-size);
            right: var(--cut-size);
            bottom: auto;
            border-left: none;
            border-top: 2px dashed #ddd;
          }

          .airport-code {
            display: none;
          }
        }
      `}</style>

      <div className="london-ticket">
        <main className="ticket-wrapper" ref={ticketRef}>
          <section className="visual-section">
            <div className="heli-wrapper">
              <picture>
                <source media="(max-width: 768px)" srcSet="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" />
                <img
                  src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png"
                  alt="R66 Turbine Helicopter"
                  loading="lazy"
                />
              </picture>
            </div>

            <div className="location-header">
              <h1>LONDON</h1>
              <p>Powered by Turbine R66</p>
            </div>
          </section>

          <section className="details-section">
            <div className="perforation"></div>
            <div className="airport-code">LDN CTY</div>

            <h2 className="tour-title">The London Tour</h2>

            <form id="ticketForm">
              <fieldset className="ticket-fieldset">
                <legend className="ticket-legend">Select Experience</legend>
                <div className="segmented-control radio-grid">
                  <div className="radio-card">
                    <input
                      type="radio"
                      name="experience"
                      id="exp-shared"
                      value="shared"
                      checked={experience === 'shared'}
                      onChange={() => setExperience('shared')}
                    />
                    <label htmlFor="exp-shared">
                      <span className="card-title">Shared</span>
                      <span className="card-desc">Fly with others</span>
                    </label>
                  </div>
                  <div className="radio-card">
                    <input
                      type="radio"
                      name="experience"
                      id="exp-private"
                      value="private"
                      checked={experience === 'private'}
                      onChange={() => setExperience('private')}
                    />
                    <label htmlFor="exp-private">
                      <span className="card-title">Private</span>
                      <span className="card-desc">Exclusive Flight</span>
                    </label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="ticket-fieldset">
                <legend className="ticket-legend">Time of Day</legend>
                <div className="segmented-control time-grid">
                  <div className="time-option">
                    <input
                      type="radio"
                      name="time"
                      id="time-day"
                      value="day"
                      checked={timeOfDay === 'day'}
                      onChange={() => setTimeOfDay('day')}
                    />
                    <label htmlFor="time-day">Daytime</label>
                  </div>
                  <div className="time-option">
                    <input
                      type="radio"
                      name="time"
                      id="time-sunset"
                      value="sunset"
                      checked={timeOfDay === 'sunset'}
                      onChange={() => setTimeOfDay('sunset')}
                    />
                    <label htmlFor="time-sunset">Sunset</label>
                  </div>
                  <div className="time-option">
                    <input
                      type="radio"
                      name="time"
                      id="time-night"
                      value="night"
                      checked={timeOfDay === 'night'}
                      onChange={() => setTimeOfDay('night')}
                    />
                    <label htmlFor="time-night">
                      Night
                      <div className="stars">
                        <div className="star"></div>
                        <div className="star"></div>
                        <div className="star"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className="controls-row">
                <fieldset className="ticket-fieldset" style={{ margin: 0, flex: 1 }}>
                  <legend className="ticket-legend">{qtyLegend}</legend>
                  <div className="qty-control">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => changeQty(-1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => changeQty(1)}
                      disabled={quantity >= maxQty}
                    >
                      +
                    </button>
                  </div>
                </fieldset>
              </div>

              <ul className="features-list">
                <li>50 Minute Flight Time</li>
                <li>Champagne Reception</li>
                <li>Turbine Engine Helicopter</li>
              </ul>

              <div className="refund-notice">
                <strong>Fully Refundable</strong> &amp; Subject to weather and availability
              </div>

              <div className="price-bar">
                <div className="price-block">
                  <small>{priceLabel}</small>
                  <div className="price-value">£{calculatePrice()}</div>
                </div>
                <button type="button" className="redeem-btn">Confirm Ticket</button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}

export default LondonTourTicket;

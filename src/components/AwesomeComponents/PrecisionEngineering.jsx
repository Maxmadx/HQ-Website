/**
 * PRECISION ENGINEERING COMPONENT
 * High-Performance - Porsche, Rimowa, VistaJet inspired
 * Saved for future use
 */

import { Link } from 'react-router-dom';

// Image imports - update these paths as needed
const imgs = {
  r66: '/assets/images/new-aircraft/r66-turbine.jpg',
};

export const PrecisionEngineering = () => (
  <section className="precision-eng">
    <div className="precision-eng__bg">
      <div className="precision-eng__gradient"></div>
    </div>

    <div className="precision-eng__grid">
      <div className="precision-eng__hairline precision-eng__hairline--1"></div>
      <div className="precision-eng__hairline precision-eng__hairline--2"></div>
      <div className="precision-eng__hairline precision-eng__hairline--3"></div>
      <div className="precision-eng__hairline precision-eng__hairline--4"></div>
    </div>

    <header className="precision-eng__header">
      <div className="precision-eng__logo">
        <span>HQ</span>
        <span className="precision-eng__logo-line"></span>
        <span>Aviation</span>
      </div>
      <nav className="precision-eng__nav">
        <span>Configure</span>
        <span>Fleet</span>
        <span>Training</span>
        <span>Contact</span>
      </nav>
    </header>

    <div className="precision-eng__content">
      <div className="precision-eng__specs">
        <div className="precision-eng__spec">
          <span className="precision-eng__spec-value">300</span>
          <span className="precision-eng__spec-unit">HP</span>
          <span className="precision-eng__spec-label">Engine Power</span>
        </div>
        <div className="precision-eng__spec">
          <span className="precision-eng__spec-value">140</span>
          <span className="precision-eng__spec-unit">KTS</span>
          <span className="precision-eng__spec-label">Cruise Speed</span>
        </div>
        <div className="precision-eng__spec">
          <span className="precision-eng__spec-value">350</span>
          <span className="precision-eng__spec-unit">NM</span>
          <span className="precision-eng__spec-label">Range</span>
        </div>
      </div>

      <div className="precision-eng__hero">
        <img src={imgs.r66} alt="" />
        <div className="precision-eng__model">R66 Turbine</div>
      </div>

      <div className="precision-eng__cta">
        <h1 className="precision-eng__headline">
          Engineered<br/>Excellence
        </h1>
        <Link to="/aircraft" className="precision-eng__btn">
          Configure Yours
          <span className="precision-eng__btn-arrow">→</span>
        </Link>
      </div>
    </div>

    <div className="precision-eng__footer">
      <span>Robinson Helicopter Company</span>
      <span>•</span>
      <span>Authorized Service Centre</span>
    </div>

    <style>{`
      .precision-eng {
        min-height: 100vh;
        background: #1a1a1a;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .precision-eng__bg {
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      .precision-eng__gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);
      }

      .precision-eng__grid {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }

      .precision-eng__hairline {
        position: absolute;
        background: rgba(255,255,255,0.05);
      }

      .precision-eng__hairline--1 { left: 20%; top: 0; bottom: 0; width: 1px; }
      .precision-eng__hairline--2 { left: 50%; top: 0; bottom: 0; width: 1px; }
      .precision-eng__hairline--3 { left: 80%; top: 0; bottom: 0; width: 1px; }
      .precision-eng__hairline--4 { top: 50%; left: 0; right: 0; height: 1px; }

      .precision-eng__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 3rem;
        z-index: 10;
        position: relative;
      }

      .precision-eng__logo {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #fff;
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.1em;
      }

      .precision-eng__logo-line {
        width: 20px;
        height: 1px;
        background: linear-gradient(to right, #c0c0c0, transparent);
      }

      .precision-eng__nav {
        display: flex;
        gap: 2.5rem;
      }

      .precision-eng__nav span {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255,255,255,0.6);
        cursor: pointer;
        transition: color 0.3s ease;
      }

      .precision-eng__nav span:hover {
        color: #fff;
      }

      .precision-eng__content {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        flex: 1;
        align-items: center;
        padding: 2rem 3rem;
        z-index: 5;
        position: relative;
      }

      .precision-eng__specs {
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }

      .precision-eng__spec {
        display: flex;
        flex-direction: column;
      }

      .precision-eng__spec-value {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.5rem;
        font-weight: 500;
        color: #fff;
        line-height: 1;
      }

      .precision-eng__spec-unit {
        font-size: 0.9rem;
        color: #c0c0c0;
        margin-left: 0.25rem;
      }

      .precision-eng__spec-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: rgba(255,255,255,0.4);
        margin-top: 0.5rem;
      }

      .precision-eng__hero {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .precision-eng__hero img {
        max-width: 100%;
        max-height: 60vh;
        object-fit: contain;
        filter: brightness(1.1) contrast(1.05);
      }

      .precision-eng__model {
        position: absolute;
        bottom: -1rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(255,255,255,0.4);
      }

      .precision-eng__cta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2rem;
      }

      .precision-eng__headline {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2rem;
        font-weight: 500;
        color: #fff;
        text-align: right;
        margin: 0;
        line-height: 1.2;
      }

      .precision-eng__btn {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 2rem;
        background: transparent;
        border: 1px solid #c0c0c0;
        color: #fff;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .precision-eng__btn:hover {
        background: #c0c0c0;
        color: #1a1a1a;
      }

      .precision-eng__btn-arrow {
        font-size: 1rem;
        transition: transform 0.3s ease;
      }

      .precision-eng__btn:hover .precision-eng__btn-arrow {
        transform: translateX(4px);
      }

      .precision-eng__footer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255,255,255,0.3);
        z-index: 10;
        position: relative;
      }

      @media (max-width: 768px) {
        .precision-eng__content {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .precision-eng__specs {
          display: none;
        }

        .precision-eng__cta {
          align-items: center;
        }

        .precision-eng__headline {
          text-align: center;
        }
      }
    `}</style>
  </section>
);

export default PrecisionEngineering;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for demonstration
const sampleFlights = [
  {
    id: 1,
    date: '12 Feb 2026',
    type: 'Training Flight',
    badge: 'dual',
    duration: '1.2',
    aircraft: 'R44 Raven II',
    registration: 'G-HQAV',
    route: 'EGLD - Local',
    instructor: 'Capt. James Wilson'
  },
  {
    id: 2,
    date: '08 Feb 2026',
    type: 'Solo Navigation',
    badge: 'solo',
    duration: '2.1',
    aircraft: 'R22 Beta II',
    registration: 'G-HQFX',
    route: 'EGLD - EGTK - EGLD',
    instructor: 'N/A'
  },
  {
    id: 3,
    date: '01 Feb 2026',
    type: 'Circuit Training',
    badge: 'dual',
    duration: '0.8',
    aircraft: 'R44 Raven II',
    registration: 'G-HQAV',
    route: 'EGLD - Local',
    instructor: 'Capt. Sarah Mitchell'
  }
];

const sampleDeposits = [
  { id: 1, date: '10 Feb 2026', description: 'Account Top-up', amount: '+£2,500.00' },
  { id: 2, date: '15 Jan 2026', description: 'Account Top-up', amount: '+£1,000.00' },
  { id: 3, date: '01 Jan 2026', description: 'New Year Bonus Credit', amount: '+£250.00' }
];

function HQAccount() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('flights');
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [userName, setUserName] = useState('Pilot');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignup && firstName) {
      setUserName(firstName);
    } else {
      setUserName('Pilot');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setDob('');
  };

  const toggleFlightDetails = (id) => {
    setExpandedFlight(expandedFlight === id ? null : id);
  };

  // Calculate total hours from flights
  const totalHours = sampleFlights.reduce((sum, flight) => sum + parseFloat(flight.duration), 0).toFixed(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .hq-account-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f9f9f9;
          min-height: 100vh;
        }

        .hq-account-container {
          width: 100%;
          padding: 40px 20px;
          box-sizing: border-box;
        }

        .hq-account-wrapper, .hello-message {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          color: #333;
        }

        .hq-account-wrapper {
          margin-bottom: 40px;
        }

        .hello-message {
          margin-bottom: 25px;
          padding: 0 5px;
        }

        .hello-message h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 5px 0;
          letter-spacing: -1px;
          color: #000;
        }

        .hello-message p {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .hello-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #999;
          text-decoration: underline;
          cursor: pointer;
          font-size: 12px;
        }

        .logout-btn:hover {
          color: #000;
        }

        .dashboard-row {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          align-items: stretch;
          width: 100%;
        }

        .stat-card {
          background: #fff;
          flex: 1;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 250px;
        }

        .stat-card.narrow {
          flex: 0.8;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          opacity: 0.5;
          margin-bottom: 10px;
        }

        .balance-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 15px;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          white-space: nowrap;
        }

        .add-btn-outline {
          background: transparent;
          color: #000;
          border: 2px solid #eee;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          height: 36px;
        }

        .add-btn-outline:hover {
          border-color: #000;
          background: #000;
          color: #fff;
          transform: translateY(-1px);
        }

        .stat-sub {
          font-size: 13px;
          opacity: 0.6;
        }

        .hours-suffix {
          font-size: 14px;
          font-weight: 700;
          color: #888;
          align-self: flex-end;
          margin-bottom: 5px;
        }

        .concierge-hero {
          flex: 1.5;
          background: #000;
          color: #fff;
          padding: 25px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
          min-width: 280px;
        }

        .concierge-content {
          display: flex;
          align-items: center;
          gap: 15px;
          z-index: 2;
        }

        .icon-wrapper-floating {
          position: relative;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          animation: gentle-float 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        .phone-icon {
          font-size: 20px;
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .concierge-text h3 {
          margin: 0 0 3px 0;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .concierge-text p {
          margin: 0;
          font-size: 12px;
          color: #aaa;
          line-height: 1.3;
        }

        .call-now-btn {
          background: #fff;
          color: #000;
          padding: 12px 20px;
          border-radius: 30px;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: transform 0.2s;
          z-index: 2;
          white-space: nowrap;
          margin-left: 10px;
        }

        .call-now-btn:hover {
          transform: scale(1.05);
        }

        /* Modal Styles */
        .hq-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
        }

        .modal-card {
          background: #fff;
          width: 90%;
          max-width: 450px;
          padding: 30px;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .close-modal:hover {
          color: #000;
        }

        .auth-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
          margin-bottom: 10px;
          font-size: 14px;
          font-family: inherit;
        }

        .auth-input:focus {
          outline: none;
          border-color: #000;
        }

        .invoice-flow-wrapper {
          padding: 10px 0;
          text-align: center;
        }

        .process-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 2;
        }

        .step-circle {
          width: 30px;
          height: 30px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }

        .step-circle.active {
          background: #fff;
          border: 2px solid #000;
          color: #000;
        }

        .step-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
        }

        .step-line {
          height: 2px;
          background: #eee;
          flex: 1;
          margin: -18px 10px 0 10px;
          max-width: 60px;
        }

        .instruction-box {
          margin-bottom: 25px;
        }

        .instruction-box p {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #333;
          line-height: 1.5;
        }

        .instruction-box .sub-instruction {
          font-size: 12px;
          color: #999;
        }

        .action-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          font-family: inherit;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .block-btn {
          display: block;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          text-decoration: none;
          padding: 16px;
        }

        .content-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f0f0f0;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }

        .card-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .history-tabs {
          display: flex;
          gap: 15px;
        }

        .h-tab {
          font-size: 14px;
          font-weight: 700;
          color: #999;
          cursor: pointer;
          padding-bottom: 5px;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .h-tab:hover {
          color: #666;
        }

        .h-tab.active {
          color: #000;
          border-bottom: 2px solid #000;
        }

        .flight-row {
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          transition: background 0.2s;
        }

        .flight-row:hover {
          background: #fafafa;
        }

        .row-main {
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .flight-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .flight-date {
          font-weight: 700;
          font-size: 14px;
        }

        .flight-sub-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flight-type {
          font-size: 12px;
          color: #666;
        }

        .badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .badge-dual {
          background: #eee;
          color: #555;
        }

        .badge-solo {
          background: #000;
          color: #fff;
        }

        .flight-meta {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .flight-duration {
          font-family: monospace;
          font-size: 14px;
          background: #eee;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .flight-row.expanded .flight-duration {
          background: #000;
          color: #fff;
        }

        .arrow-icon {
          font-size: 12px;
          color: #ccc;
          transition: 0.3s;
        }

        .flight-row.expanded .arrow-icon {
          transform: rotate(180deg);
          color: #000;
        }

        .row-details {
          overflow: hidden;
          background: #fdfdfd;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
          margin-top: 5px;
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item label {
          font-size: 10px;
          font-weight: 700;
          color: #999;
          margin-bottom: 3px;
        }

        .detail-item span {
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }

        .deposit-row {
          padding: 20px 0;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .deposit-info div {
          font-weight: 700;
          font-size: 14px;
        }

        .deposit-info span {
          font-size: 12px;
          color: #888;
        }

        .deposit-amount {
          font-weight: 800;
          color: #28a745;
          font-size: 16px;
          white-space: nowrap;
        }

        .toggle-auth {
          font-size: 12px;
          cursor: pointer;
          color: #666;
          text-decoration: underline;
          margin-top: 15px;
          background: none;
          border: none;
          font-family: inherit;
        }

        .toggle-auth:hover {
          color: #000;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 20px;
        }

        .dob-label {
          text-align: left;
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #999;
          margin: 5px 0 2px 5px;
        }

        @media(max-width: 950px) {
          .dashboard-row {
            flex-direction: column;
            gap: 15px;
          }

          .concierge-hero {
            text-align: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            padding: 25px;
          }

          .concierge-content {
            flex-direction: column;
          }

          .call-now-btn {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            margin-left: 0;
          }

          .stat-card {
            text-align: center;
          }

          .balance-row {
            justify-content: center;
          }
        }

        /* Header styles for this page */
        .hq-account-header {
          background: #fff;
          border-bottom: 1px solid #eee;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hq-account-header .logo {
          height: 40px;
        }

        .hq-account-header nav {
          display: flex;
          gap: 30px;
        }

        .hq-account-header nav a {
          text-decoration: none;
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }

        .hq-account-header nav a:hover {
          color: #000;
        }

        .hq-account-footer {
          background: #fff;
          border-top: 1px solid #eee;
          padding: 60px 20px;
          text-align: center;
        }

        .footer-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
          margin-bottom: 25px;
        }

        .footer-logos img {
          height: 80px;
          object-fit: contain;
        }

        .footer-text h3 {
          margin: 0 0 8px 0;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #000;
          line-height: 1.3;
        }

        .footer-copyright {
          margin-top: 40px;
          font-size: 13px;
          color: #666;
        }

        @media(max-width: 600px) {
          .hq-account-header {
            padding: 15px 20px;
          }

          .hq-account-header nav {
            display: none;
          }

          .footer-logos {
            flex-direction: column;
            gap: 30px;
          }

          .footer-logos img {
            height: 60px;
          }

          .footer-text h3 {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <div className="hq-account-page">
        {/* Header */}
        <header className="hq-account-header">
          <Link to="/">
            <img
              src="/assets/images/logos/hq/hq-aviation-logo-black.png"
              alt="HQ Aviation"
              className="logo"
            />
          </Link>
          <nav>
            <Link to="/fleet">Fleet</Link>
            <Link to="/training/ppl">Training</Link>
            <Link to="/expeditions">Expeditions</Link>
            <Link to="/maintenance">Maintenance</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </header>

        {/* Auth Modal */}
        <AnimatePresence>
          {!isAuthenticated && (
            <motion.div
              className="hq-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="modal-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                style={{ textAlign: 'center' }}
              >
                <div className="card-header" style={{ borderBottom: 'none', justifyContent: 'center' }}>
                  <h3>{isSignup ? 'Create Account' : 'HQ Login'}</h3>
                </div>

                <form className="auth-form" onSubmit={handleAuth}>
                  {isSignup && (
                    <>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="auth-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="auth-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="auth-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <label className="dob-label">DATE OF BIRTH</label>
                      <input
                        type="date"
                        className="auth-input"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </>
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button type="submit" className="action-btn block-btn" style={{ marginTop: '10px' }}>
                    ENTER HQ
                  </button>

                  <button
                    type="button"
                    className="toggle-auth"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? 'Already have an account? Login' : 'New Pilot? Create Account'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isAuthenticated && (
          <div className="hq-account-container">
            {/* Hello Message */}
            <div className="hello-message">
              <div className="hello-header">
                <div>
                  <h1>Hello, {userName}.</h1>
                  <p>Here is your account overview.</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            {/* Dashboard */}
            <div className="hq-account-wrapper">
              <div className="dashboard-row">
                {/* Balance Card */}
                <div className="stat-card">
                  <div className="stat-label">HQ CARD BALANCE</div>
                  <div className="balance-row">
                    <div className="stat-value">£4,250</div>
                    <button
                      className="add-btn-outline"
                      onClick={() => setShowFundsModal(true)}
                    >
                      + ADD FUNDS
                    </button>
                  </div>
                  <div className="stat-sub">Available to fly</div>
                </div>

                {/* Flight Hours Card */}
                <div className="stat-card narrow">
                  <div className="stat-label">TOTAL FLIGHT TIME</div>
                  <div className="balance-row">
                    <div className="stat-value">{totalHours}</div>
                    <span className="hours-suffix">HRS</span>
                  </div>
                  <div className="stat-sub">Flown</div>
                </div>

                {/* Schedule Flight Card */}
                <div className="concierge-hero">
                  <div className="concierge-content">
                    <div className="icon-wrapper-floating">
                      <div className="phone-icon">📞</div>
                    </div>
                    <div className="concierge-text">
                      <h3>Schedule a Flight</h3>
                      <p>Contact Operations to check availability.</p>
                    </div>
                  </div>
                  <a href="tel:+441onal484772" className="call-now-btn">
                    CALL OPS →
                  </a>
                </div>
              </div>

              {/* History Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="history-tabs">
                    <div
                      className={`h-tab ${activeTab === 'flights' ? 'active' : ''}`}
                      onClick={() => setActiveTab('flights')}
                    >
                      Flights
                    </div>
                    <div
                      className={`h-tab ${activeTab === 'deposits' ? 'active' : ''}`}
                      onClick={() => setActiveTab('deposits')}
                    >
                      Deposits
                    </div>
                  </div>
                </div>

                {/* Flights List */}
                {activeTab === 'flights' && (
                  <div className="flight-list">
                    {sampleFlights.map((flight) => (
                      <div
                        key={flight.id}
                        className={`flight-row ${expandedFlight === flight.id ? 'expanded' : ''}`}
                        onClick={() => toggleFlightDetails(flight.id)}
                      >
                        <div className="row-main">
                          <div className="flight-info">
                            <div className="flight-date">{flight.date}</div>
                            <div className="flight-sub-line">
                              <span className="flight-type">{flight.type}</span>
                              <span className={`badge badge-${flight.badge}`}>
                                {flight.badge}
                              </span>
                            </div>
                          </div>
                          <div className="flight-meta">
                            <span className="flight-duration">{flight.duration} hrs</span>
                            <span className="arrow-icon">▼</span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedFlight === flight.id && (
                            <motion.div
                              className="row-details"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <label>AIRCRAFT</label>
                                  <span>{flight.aircraft}</span>
                                </div>
                                <div className="detail-item">
                                  <label>REGISTRATION</label>
                                  <span>{flight.registration}</span>
                                </div>
                                <div className="detail-item">
                                  <label>ROUTE</label>
                                  <span>{flight.route}</span>
                                </div>
                                <div className="detail-item">
                                  <label>INSTRUCTOR</label>
                                  <span>{flight.instructor}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deposits List */}
                {activeTab === 'deposits' && (
                  <div className="deposit-list">
                    {sampleDeposits.map((deposit) => (
                      <div key={deposit.id} className="deposit-row">
                        <div className="deposit-info">
                          <div>{deposit.date}</div>
                          <span>{deposit.description}</span>
                        </div>
                        <div className="deposit-amount">{deposit.amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Funds Modal */}
        <AnimatePresence>
          {showFundsModal && (
            <motion.div
              className="hq-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFundsModal(false)}
            >
              <motion.div
                className="modal-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-modal"
                  onClick={() => setShowFundsModal(false)}
                >
                  ×
                </button>
                <div className="card-header" style={{ borderBottom: 'none' }}>
                  <h3>Add Funds</h3>
                </div>

                <div className="invoice-flow-wrapper">
                  <div className="process-steps">
                    <div className="step-item">
                      <div className="step-circle">1</div>
                      <span className="step-label">Call Ops</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-item">
                      <div className="step-circle">2</div>
                      <span className="step-label">Invoice</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-item">
                      <div className="step-circle active">3</div>
                      <span className="step-label">Updated</span>
                    </div>
                  </div>

                  <div className="instruction-box">
                    <p>Funds are added via invoice. Contact Operations to generate a top-up request.</p>
                    <p className="sub-instruction">Your balance will update automatically upon payment.</p>
                  </div>

                  <a href="tel:+441484772" className="action-btn block-btn">
                    CALL HQ TO ADD FUNDS
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="hq-account-footer">
          <div className="footer-logos">
            <img
              src="/assets/images/legacy/misc/gemini_generated_image_soxg2ysoxg2ysoxg.png"
              alt="UK CAA"
            />
            <img
              src="/assets/images/legacy/misc/gemini_generated_image_9x2j059x2j059x2j.png"
              alt="Robinson Helicopter"
            />
          </div>
          <div className="footer-text">
            <h3>Robinson Authorised Dealer & Service Center</h3>
            <h3>CAA Declared Training Organisation & Part 145 Maintenance Facility</h3>
          </div>
          <div className="footer-copyright">
            Copyright © HQ Aviation 2026
          </div>
        </footer>
      </div>
    </>
  );
}

export default HQAccount;

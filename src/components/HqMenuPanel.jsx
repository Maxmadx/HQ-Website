import { Link } from 'react-router-dom';

function HqMenuPanel({ open, onClose }) {
  const close = () => { if (onClose) onClose(); };

  return (
    <div className={`hq-menu-panel ${open ? 'open' : ''}`}>
      <div className="hq-menu-grid">
        <div className="hq-menu-section">
          <h3>About</h3>
          <ul>
            <li><Link to="/" onClick={close}>Home</Link></li>
            <li><Link to="/about-us" onClick={close}>About Us</Link></li>
            <li><Link to="/about-us/captain-q" onClick={close}>Quentin Smith</Link></li>
          </ul>
        </div>
        <div className="hq-menu-section">
          <h3>Aircraft Sales</h3>
          <ul>
            <li><Link to="/aircraft-sales" onClick={close}>New Aircraft</Link></li>
            <li><Link to="/aircraft-sales/new/r88" onClick={close}>R88</Link></li>
            <li><Link to="/aircraft-sales/new/r66" onClick={close}>R66</Link></li>
            <li><Link to="/aircraft-sales/new/r44" onClick={close}>R44</Link></li>
            <li><Link to="/aircraft-sales/new/r22" onClick={close}>R22</Link></li>
          </ul>
        </div>
        <div className="hq-menu-section">
          <h3>Flight Training</h3>
          <ul>
            <li><Link to="/training" onClick={close}>Training Overview</Link></li>
            <li><Link to="/training/trial-lessons" onClick={close}>Discovery Flights</Link></li>
            <li><Link to="/training/ppl" onClick={close}>Private Pilot License</Link></li>
            <li><Link to="/training/type-rating" onClick={close}>Type Rating</Link></li>
            <li><Link to="/training/faq" onClick={close}>Training FAQ</Link></li>
          </ul>
        </div>
        <div className="hq-menu-section">
          <h3>Services</h3>
          <ul>
            <li><Link to="/maintenance" onClick={close}>Maintenance</Link></li>
            <li><Link to="/expeditions" onClick={close}>Expeditions</Link></li>
            <li><Link to="/self-fly-hire" onClick={close}>Self-Fly Hire</Link></li>
          </ul>
        </div>
        <div className="hq-menu-section">
          <h3>Contact</h3>
          <ul>
            <li><Link to="/blog" onClick={close}>Blog</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HqMenuPanel;

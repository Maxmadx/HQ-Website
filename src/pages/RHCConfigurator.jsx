import React, { useEffect } from 'react';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';

import '../assets/css/main.css';
import '../assets/css/components.css';

const CONFIGURATOR_URL = 'https://configurator.robinsonheli.com/';

function RHCConfigurator() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="rhc-configurator-page">
      <Seo
        title="Robinson Helicopter Configurator"
        description="Configure your new Robinson R22, R44 or R66 with HQ Aviation, Robinson's UK authorised dealer at Denham."
        noindex
      />
      <Header />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 80px)',
          background: '#faf9f6',
        }}
      >
        <div
          style={{
            padding: '0.6rem 1.25rem',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#7a7a7a',
            borderBottom: '1px solid #e5e4df',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span>Powered by Robinson Helicopter Company</span>
          <a
            href={CONFIGURATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
          >
            Open in new tab
          </a>
        </div>

        <iframe
          src={CONFIGURATOR_URL}
          title="Robinson Helicopter Configurator"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
          style={{
            flex: 1,
            width: '100%',
            minHeight: 'calc(100vh - 160px)',
            border: 0,
            display: 'block',
            background: '#ffffff',
          }}
        />
      </main>

      <FooterMinimal />
    </div>
  );
}

export default RHCConfigurator;

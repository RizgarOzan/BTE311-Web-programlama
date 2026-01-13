import React from 'react';

const Header = () => {
  // Modern dark theme header styles
  const headerStyle = {
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '28px 20px',
    textAlign: 'center'
  };

  const h1Style = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.5px'
  };

  const pStyle = {
    marginTop: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.95rem',
    fontWeight: '400'
  };

  return (
    <header style={headerStyle}>
      <h1 style={h1Style}>🌤️ Hava Durumu Uygulaması</h1>
      <p style={pStyle}>Şehrinizin hava durumunu öğrenin</p>
    </header>
  );
};

export default Header;
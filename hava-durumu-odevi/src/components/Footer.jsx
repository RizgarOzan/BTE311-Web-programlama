import React from 'react';

const Footer = () => {
  const footerStyle = {
    background: 'rgba(15, 23, 42, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    padding: '20px',
    fontSize: '0.9rem'
  };

  return (
    <footer style={footerStyle}>
      <p>© 2026 BÖTE React Ödevi - Rızgar Ozan</p>
    </footer>
  );
};

export default Footer;
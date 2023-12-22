import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="about-us">
          <h3>About Us</h3>
          <p>Information about the team...</p>
        </div>
        <div className="contact-us">
          <h3>Contact Us</h3>
          <p>Contact details...</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

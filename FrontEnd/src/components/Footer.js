import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Assuming you have a separate CSS file for the footer

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="about-us">
          <h3>About Us</h3>
          <Link to="/about-us">Learn more about us</Link>
        </div>
        <div className="contact-us">
          <h3>Contact Us</h3>
          <p>fdrs1697@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

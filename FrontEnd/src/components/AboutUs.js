import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AboutUs.css'; // Make sure this is correctly imported

const AboutUs = () => {
  const location = useLocation(); // This hook gets the current location object
  const isAboutUs = location.pathname === '/about-us'; // Checks if the pathname is exactly '/about-us'
  const backgroundImage = '/about-us.png'; // Replace with the correct path to your image

  useEffect(() => {
    // Apply styles only if it's the "About Us" page
    if (isAboutUs) {
      const originalStyle = window.getComputedStyle(document.body);

      // Apply styles
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundAttachment = 'fixed';

      // Cleanup function to revert styles
      return () => {
        document.body.style.backgroundImage = originalStyle.backgroundImage;
        document.body.style.backgroundSize = originalStyle.backgroundSize;
        document.body.style.backgroundRepeat = originalStyle.backgroundRepeat;
        document.body.style.backgroundPosition = originalStyle.backgroundPosition;
        document.body.style.backgroundAttachment = originalStyle.backgroundAttachment;
      };
    }
  }, [isAboutUs, backgroundImage]);

  return (
    <div className="about-us-page">
      <div className="main-content">
        <section className="company-overview">
          <h2>About Our Company</h2>
          <p>Company overview...</p>
        </section>
        <section className="team-members">
          <h2>Our Team</h2>
          {/* Team members info */}
        </section>
        <section className="history">
          <h2>Our History</h2>
          {/* History info */}
        </section>
        <section className="values-culture">
          <h2>Our Values and Culture</h2>
          {/* Values and culture info */}
        </section>
        <section className="contact-info">
          <h2>Contact Us</h2>
          {/* Contact information */}
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

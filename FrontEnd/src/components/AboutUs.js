import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const location = useLocation();
  const isAboutUs = location.pathname === '/about-us';
  const backgroundImage = '/about-us.png'; // Replace with the correct path to your image

  useEffect(() => {
    if (isAboutUs) {
      const originalStyle = window.getComputedStyle(document.body).background;

      document.body.style.background = `url(${backgroundImage}) center center / cover no-repeat fixed`;

      return () => {
        document.body.style.background = originalStyle;
      };
    }
  }, [isAboutUs, backgroundImage]);

  return (
    <div className="about-us-page">
      <div className="main-content">
          <h2>About the Faculty of Information Technology</h2>
        <p>
          At the heart of technological advancement and innovation lies the Faculty of Information Technology at Middle East University, a hub of excellence in Computer Science. Our department is dedicated to fostering a transformative educational experience, bridging the gap between academic theories and real-world applications.
        </p>
        <h2>Our Esteemed Faculty</h2>
        <p>
          Led by the visionary Dr. Ashraf Odeh, our faculty comprises seasoned educators and researchers committed to guiding the next generation of tech leaders and innovators.
        </p>
        <h2>Our Journey</h2>
        <p>
          Since our inception, we have been at the forefront of academic excellence, constantly evolving to meet the challenges of the ever-changing tech landscape. Our journey is marked by continuous innovation and dedication to student success.
        </p>
        <h2>Our Mission and Values</h2>
        <p>
          Our mission is to empower students with cutting-edge knowledge and practical skills in Computer Science. We value innovation, collaboration, and the pursuit of excellence, as evidenced by our groundbreaking project, the Free Distribution Resource System (FDRS).
        </p>
        <h2>Contact Us</h2>
        <p>
          For more information about our programs and initiatives, please contact us at fdrs1697@gmail.com. We are always eager to engage with prospective students, researchers, and collaborators.
        </p>
          <h2>Connect with Us</h2>
          <div className="social-buttons">
            <a href="https://www.linkedin.com/in/anas-alseid-3b08631bb/" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin-icon.png" alt="LinkedIn Anas Alseid" /> Anas Alseid
            </a>
            <a href="https://www.linkedin.com/in/saif-karborani-a25a98222?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin-icon.png" alt="LinkedIn Saif Karborani" /> Saif Karborani
            </a>
            <a href="https://www.linkedin.com/in/wasef-jayousi-5022aa250/" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin-icon.png" alt="LinkedIn Wasef Joyousi" /> Wasef Joyousi
            </a>
            <a href="https://github.com/notanaas/FDRS.git" target="_blank" rel="noopener noreferrer">
              <img src="/github-icon.png" alt="GitHub" /> GitHub Repository
            </a>
            <a href="https://www.youtube.com/channel/UCvvQh8RPnGf8Z-AZrahYEbA" target="_blank" rel="noopener noreferrer">
              <img src="/youtube-icon.png" alt="YouTube" /> YouTube Channel
            </a>
          </div>
 
</div>
    </div>
  );
};

export default AboutUs;
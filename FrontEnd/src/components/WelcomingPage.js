import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import './WelcomingPage.css';
const messages = [
  'Create Your Account',
  'Login',
  'Search for resources',
  'Not Found? Send us a feedback we will find it',
  'Upload resources to your faculty',
  'Wait for Authorization',
  'Your Dashboard'
];
const WelcomingPage = () => {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const { authToken } = useContext(AuthContext);
  const backgroundImage = `/WelcomingPage.png`;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const dashboardIndex = messages.indexOf('Your Dashboard'); // Get the index of 'Your Dashboard' message

  useEffect(() => {
    const originalStyle = {
      overflow: document.body.style.overflow,
      backgroundImage: document.body.style.backgroundImage
    };

    document.body.style.backgroundImage =
      `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 1)), url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';

    // Cleanup function to revert styles
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.backgroundImage = originalStyle.backgroundImage;
    };

  }, [backgroundImage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Change text every 2 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div className='wlcImage'>
      <img src="/logo.png" alt="Website Logo" />
      <div className="bottom-left-text">
        <h1>{messages[currentMessageIndex]}</h1>

      </div>
      {currentMessageIndex === dashboardIndex && (
        <div className="arrow-to-profile">
        </div>
      )}
      <div className="arrow-container-top">
        <div className="arrow-top"></div>
        <span className="arrow-text-top">Explore</span> {/* Text to accompany the arrow-top */}
      </div>

      {/*Test text*/}
    <div className="welcome-container">
        <h1>Welcome to our Educational Platform</h1>
        <h2>
          Explore a world of knowledge. Sign up for free and access a wealth of
          educational resources.
        </h2>
        <h2>
          <p>
          Free Registration:
          Our platform allows students to register easily and for free, opening doors to access a wide range of educational resources.
          </p>
          Valuable Educational References:
          The site offers a rich collection of educational references covering various subjects. Students can easily download these references and save them on their devices for convenient access anytime, anywhere.

          Diverse Study Categories:
          The platform includes educational resources in a variety of subjects and academic levels, enabling students to find content that suits their individual learning needs.

          Interactive and User-Friendly:
          The site's interface is designed to be interactive and user-friendly, making it comfortable for students of all age groups to browse resources and download references.

          Technical Support:
          We provide technical support to students in case they encounter any difficulties using the site or downloading resources, ensuring a smooth and effective learning experience.

          Our Vision:
          We aim to promote self-directed learning and provide high-quality educational opportunities for everyone, contributing to the development of a cultured and educated community.

          We hope you have a fruitful learning experience on our platform, where learning is enjoyable and accessible to all.
        </h2>
    </div>
    {/*test text*/}
    </div>

  );
};

export default WelcomingPage;

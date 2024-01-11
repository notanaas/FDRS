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
    <img src="/logo.png" alt="Website Logo"  />
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
         
        </div>
  );
};

export default WelcomingPage;

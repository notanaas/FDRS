import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import { AuthContext } from './context/AuthContext';
import './App.css';

const WelcomingPage = () => {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const { authToken } = useContext(AuthContext);
  const backgroundImage = `/WelcomingPage.png`;

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

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000); // Message disappears after 4 seconds

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [authToken]);

  return (
    <div className="welcoming-container">
      <Header />
      {showMessage && <div className="header-message">{message}</div>}

    </div>
  );
};

export default WelcomingPage;

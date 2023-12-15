import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import { Parallax } from "./parallax-4/Parallax";
import { AuthContext } from './context/AuthContext';
import './App.css';

const WelcomingPage = () => {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    

    

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000); // Message disappears after 4 seconds

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [authToken]);

  return (
    <div >
      <Header />
      {showMessage && <div className="header-message">{message}</div>}
      <Parallax /> {/* Include the Parallax component */}

    </div>
  );
};

export default WelcomingPage;

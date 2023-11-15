import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import { AuthContext } from './context/AuthContext';
import './App.css';

const WelcomingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [message, setMessage] = useState(''); // Define message state
  const [showMessage, setShowMessage] = useState(false); // Define showMessage state
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (authToken) {
      setMessage('Welcome, you are logged in!');
      setShowMessage(true);
    } else {
      setMessage('You are not logged in.');
      setShowMessage(true);
    }

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000); // Message will disappear after 4 seconds

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [authToken, isDarkMode]);

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
      <main>
        {showMessage && <div className="header-message">{message}</div>}
        <p>Welcome to the page!</p>
      </main>
    </div>
  );
};

export default WelcomingPage;

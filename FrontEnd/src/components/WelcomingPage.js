import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import { useAuth } from './context/AuthContext';
import { Redirect } from 'react-router-dom'; // Make sure to import Redirect

import './App.css';

const WelcomingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Added a setter for isDarkMode
  const { token } = useAuth(); // Use the useAuth hook to get the current token

  useEffect(() => {
    // Apply dark mode class to the document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Redirect if there is no token (user is not logged in)
  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
      <main>
        <p>Welcome, you are logged in!</p>
        {token ? (
          <p>Welcome, you are logged in!</p>
        ) : (
          <p>Please log in to access more features.</p>
        )}
      </main>
          </div>
    
  );
};

export default WelcomingPage;

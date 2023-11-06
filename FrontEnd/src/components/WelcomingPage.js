import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import axios from 'axios';

import './App.css';

const WelcomingPage = () => {
  const apiEndpoint = 'http://localhost:3002';
  const userToken = localStorage.getItem('token');
  const [isDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!userToken);

  useEffect(() => {
    // Check local storage for an existing token
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token with the backend to ensure it's still valid
      axios.get('/verifyToken', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        // If token is verified, set login state
        setIsLoggedIn(true);
      }).catch(error => {
        // If token is not valid, handle accordingly, perhaps by logging out
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [isDarkMode]);
      
    }
  }, []);
  
  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
    </div>
    
  );
};

export default WelcomingPage;

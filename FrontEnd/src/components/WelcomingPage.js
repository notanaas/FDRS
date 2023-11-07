import React, { useState, useEffect,useContext } from 'react';
import Header from './Header'; 
import { AuthContext } from './context/AuthContext';
import { Redirect } from 'react-router-dom'; 
import './App.css';

const WelcomingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Added a setter for isDarkMode
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    // Apply dark mode class to the document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Redirect if there is no token (user is not logged in)
 

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
      <main>
        <p>Welcome, you are logged in!</p>
       
      </main>
          </div>
    
  );
};

export default WelcomingPage;

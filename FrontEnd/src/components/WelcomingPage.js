import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import './App.css';

const WelcomingPage = () => {
  const [isDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  
  
  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
    </div>
    
  );
};

export default WelcomingPage;

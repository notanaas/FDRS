import React, { useState, useEffect } from 'react';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import Header from './Header'; 
import './App.css'; 
import Footer from './Footer'; 
import { useDarkMode } from './DarkModeContext'; 

const WelcomingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
    </div>
    
  );
};

export default WelcomingPage;

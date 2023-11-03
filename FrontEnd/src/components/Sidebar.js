import React, { useState, useEffect } from 'react';
import './App.css';

function Sidebar({ onClose ,isDarkMode}) {
  const [localIsDarkMode, setLocalIsDarkMode] = useState(false);
  const modalContentStyle = {
    backgroundColor: localIsDarkMode ? 'black' : 'white', 
    color: localIsDarkMode ? 'white' : 'black', 
  };
  useEffect(() => {
    setLocalIsDarkMode(isDarkMode);
  }, [isDarkMode]);
  return (
    <div className="sidebar" style={modalContentStyle} >

      <button className="closeBtn" onClick={onClose}isDarkMode={isDarkMode}>Close</button>
      <p>Sidebar content here...</p>
    </div>
  );
}

export default Sidebar;

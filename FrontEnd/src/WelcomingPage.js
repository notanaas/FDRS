import React, { useState, useEffect } from 'react';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import Header from './Header'; // Import the Header component
import './App.css'; // Import your styles
import Footer from './Footer'; // Import the Header component
import { useDarkMode } from './DarkModeContext'; // Import the useDarkMode hook

const WelcomingPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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
  const handleFacultySelection = (FacultyName) => {
    setSelectedFaculty(FacultyName);
  };
  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
    
      <div >
        <p>Welcome to our FDRS!</p>
        <p>Explore our faculties</p>
        <FacultyButtons onFacultySelect={handleFacultySelection} />
        <p>                                                      </p>
        {selectedFaculty && (
          <div>
            <h2>Upload Files for {selectedFaculty}</h2>
            <FileUpload />
          </div>
        )}
      </div>
      <Footer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

    </div>
    
  );
};

export default WelcomingPage;

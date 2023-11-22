import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useFaculty } from './context/FacultyContext';
import axios from 'axios';

const FacultyPage = ({ match }) => {
  const [facultyData, setFacultyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = 'http://localhost:3002';
  const { setCurrentFaculty } = useFaculty();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/faculty/${match.params.facultyId}`);
        setFacultyData(response.data);
        setIsLoading(false);
        setCurrentFaculty(response.data.name); // Assume the faculty name is in the response
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeChangeListener = (e) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    darkModeMediaQuery.addEventListener('change', darkModeChangeListener);
  
    
      return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
      setCurrentFaculty(null);
    };
    
  }, [setCurrentFaculty]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header isFacultyPage={true} /> 
    <div>
      <h1>Faculty Page</h1>
      {facultyData && (
        <div>
          <h2>{facultyData.name}</h2>
        </div>
      )}
    </div>
    </div>

  );
};

export default FacultyPage;

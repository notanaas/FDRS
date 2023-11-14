import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomingPage from './WelcomingPage';
import { useHistory } from 'react-router-dom';
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api_faculty/Faculties');
        setFaculties(response.data.facultyNames); // Make sure the backend sends the data in this format
      } catch (error) {
        console.error('Failed to fetch faculties:', error);
      }
    };

    fetchFaculties();
  }, []);

  const navigateToFacultyPage = (facultyId) => {
    history.push(`/faculty/${facultyId}`);
  };

  return (
    <div className='sides'>
      {faculties.length > 0 ? (
        faculties.map((faculty) => (
          <button
            key={faculty._id}
            onClick={() => navigateToFacultyPage(faculty._id)}
            className="facultyauthButton" // This could be a CSS class for styling
          >
            {faculty.FacultyName}
          </button>
        ))
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};

export default FacultyButtons;

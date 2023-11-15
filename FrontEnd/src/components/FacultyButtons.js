import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; // Import AuthContext
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const history = useHistory();
  const { authToken } = useContext(AuthContext); // Use AuthContext to check for token

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
    if (authToken) {
      // If logged in, send the token to the FacultyPage via state
      history.push({
        pathname: `/faculty/${facultyId}`,
        state: { token: authToken }
      });
    } else {
      // If not logged in, just navigate without state
      history.push(`/faculty/${facultyId}`);
    }
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

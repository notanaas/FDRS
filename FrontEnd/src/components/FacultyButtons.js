import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory,Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; // Import AuthContext
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const history = useHistory();
  const { authToken } = useContext(AuthContext); // Use AuthContext to check for token
  const userToken = localStorage.getItem('token'); // Retrieve token from local storage

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

  

  return (
    <div className='sides'>
      <h1>Select a Faculty</h1>
      {faculties.length > 0 ? (
        faculties.map((faculty) => (
          <Link 
            key={faculty._id} 
            to={{
              pathname: `/faculty/${faculty._id}`,
              state: { token: userToken } // Pass the token in the state
            }}
            className="facultyauthButtonLink" 
          >
            <button className="facultyauthButton">
              {faculty.FacultyName}
            </button>
          </Link>
        ))
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};

export default FacultyButtons;

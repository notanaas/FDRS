import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
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
      <h1>Faculties</h1>
      {faculties.length > 0 ? (
        faculties.map((faculty) => (
          <Link 
            key={faculty._id} // Ensure '_id' is the correct property name
            to={`/faculty/${faculty._id}`} // Simplified pathname for clarity
            className="facultyauthButtonLink" 
          >
            {/* <button className="facultyauthButton"> */}
              {faculty.FacultyName} 
            {/* </button> */}
          </Link>
        ))
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};

export default FacultyButtons;

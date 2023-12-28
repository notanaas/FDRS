import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header'; // Ensure this is the correct path
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3002/api_faculty/Faculties', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFaculties(response.data.facultyNames);
        setError('');
      } catch (error) {
        console.error('Failed to fetch faculties:', error);
        setError('Failed to load faculties');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (loading) return <div> <Header isLoading={loading} /> {/* @saif */}  </div>;
  if (error) return <div>Error: {error}</div>;

  
  return (
    <div className='faculty-buttons-container'>
      
      {faculties.length > 0 ? (
        faculties.map(faculty => {
          const imageUrl = `/images/${faculty.FacultyName.toLowerCase().replace(/ /g, '-')}.png`;
          return (
            <Link 
              key={faculty._id}
              to={{
                pathname: `/faculty/${faculty._id}`,
                state: { facultyName: faculty.FacultyName }
              }}
              className="faculty-button"
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              {faculty.FacultyName}
            </Link>
          );
        })
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};
export default FacultyButtons;
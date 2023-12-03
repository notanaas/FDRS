import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchFaculties = async () => {
      try {
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

  if (loading) return <div>Loading faculties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='sides'>
      <h1>Faculties</h1>
      {faculties.length > 0 ? (
        faculties.map(Faculty => (
          <Link 
            key={Faculty._id}
            to={`/faculty/${Faculty._id}`}
            className="facultyauthButtonLink"
          >
            {Faculty.FacultyName}
          </Link>
        ))
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};

export default FacultyButtons;

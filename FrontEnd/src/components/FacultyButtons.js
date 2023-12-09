import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { Link } from 'react-router-dom';
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, authToken,refreshTokenFunc } = useContext(AuthContext);

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
        faculties.map(faculty => (
          <Link 
          key={faculty._id}
          to={{
            pathname: `/faculty/${faculty._id}`,
            state: { facultyName: faculty.FacultyName } // Ensure this matches your data structure
          }}
          className="facultyauthButtonLink"
        >
          {faculty.FacultyName}
        </Link>
        
        
        ))
      ) : (
        <p>No faculties found.</p>
      )}
    </div>
  );
};
export default FacultyButtons;
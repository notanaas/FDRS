import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Link } from 'react-router-dom';
import Header from './Header'; // Ensure this is the correct path
import './App.css';

const FacultyButtons = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState('');
  const { user, authToken,refreshTokenFunc } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fdrs-backend.up.railway.app/api_faculty/Faculties', {
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

  const goToFacultyPage = (faculty) => {
    history.push({
      pathname: `/faculty/${faculty._id}`,
      state: { 
        facultyName: faculty.FacultyName,
        backgroundImage: `images/${faculty.backgroundImage}` 
      }
    });
  };
  return (
    <div className='faculty-buttons-container'>
      
      {faculties.length > 0 ? (
        faculties.map(faculty => {
          // Convert faculty name to kebab-case for the image filename
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
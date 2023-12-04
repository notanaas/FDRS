import React, { useState, useEffect, useContext } from 'react';
import DocumentCard from './DocumentCard'; 
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';

const FacultyPage = () => {
  const [resources, setResources] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const backendURL = 'http://localhost:3002';
  const { facultyId } = useParams();
  const { authToken } = useContext(AuthContext);

  

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (facultyId) {
          const response = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
          setResources(response.data.resource_list);
        } else {
          console.error('Faculty ID is undefined or null');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching resources.');
      }
    };    
    fetchResources();
  }, [facultyId, authToken,backendURL]);

  const isResourceFavorited = resourceId => userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };
  
  return (
    <div>
      <h1>Resources for Faculty</h1>
      <div className="faculty-container">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <DocumentCard 
              key={resource._id} 
              document={resource} 
              onClick={() => handleCardClick(resource._id)} 
              isFavorited={isResourceFavorited(resource._id)}
            />
          ))
        ) : (
          <p>No resources found for this faculty.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;

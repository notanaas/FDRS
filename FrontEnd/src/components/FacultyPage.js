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
  const { setRouteParams } = useContext(RouteParamsContext);

  useEffect(() => {
    // Ensure facultyId is set in the RouteParamsContext
    setRouteParams({ facultyId });
  }, [facultyId, setRouteParams]);

  useEffect(() => {
    // Function to fetch user profile and update favorites
    const fetchUserProfile = async () => {
      try {
        const profileResponse = await axios.get(`${backendURL}/api_user/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserFavorites(profileResponse.data.UserFavorites.map(fav => fav.Resource._id));
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    // Function to fetch resources for the faculty
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

    // Only fetch data if authToken is available
    if (authToken) {
      fetchResources();
      fetchUserProfile();
    }
  }, [facultyId, authToken, backendURL]);

  // Function to check if a resource is favorited
  const isResourceFavorited = resourceId => userFavorites.includes(resourceId);

  // Function to handle click on a document card
  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  // Render error message if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Main render
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

import React, { useState, useEffect, useContext } from 'react';
import DocumentCard from './DocumentCard'; 
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';
import { jwtDecode } from 'jwt-decode';

const FacultyPage = () => {
  const [resources, setResources] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const backendURL = 'http://localhost:3002';
  const { facultyId } = useParams();
  const { authToken, refreshTokenFunc } = useContext(AuthContext);
  const { setRouteParams } = useContext(RouteParamsContext);
 
  useEffect(() => {
    setRouteParams({ facultyId });
  }, [facultyId, setRouteParams]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileResponse = await axios.get(`${backendURL}/api_user/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const favoriteIds = profileResponse.data.userFavorites.map(fav => fav.Resource._id);
        setUserFavorites(profileResponse.data.userFavorites);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
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
    const tokenIsExpired = (token) => {
      if (!token) return true;
  
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
  
      return decoded.exp < currentTime;
    };
  
    const ensureValidToken = async () => {
      if (tokenIsExpired(authToken)) { // Add your token expiration check logic
        await refreshTokenFunc();
      }
    };
    
      fetchUserProfile();
      fetchResources();

   
  }, [facultyId, authToken, backendURL]);

  const isResourceFavorited = resourceId => userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  const toggleFavorite = async (resourceId) => {
    try {
      await axios.post(`${backendURL}/api_user/toggle_favorite/${resourceId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      setUserFavorites(currentFavorites => {
        return currentFavorites.includes(resourceId)
          ? currentFavorites.filter(id => id !== resourceId)
          : [...currentFavorites, resourceId];
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };
  
  if (error) {
    return <div>Error: {error}</div>;
  }

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
              onToggleFavorite={() => toggleFavorite(resource._id)}

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
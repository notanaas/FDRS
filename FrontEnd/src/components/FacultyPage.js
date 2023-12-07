import React, { useState, useEffect, useContext } from 'react';
import DocumentCard from './DocumentCard';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement

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
    const tokenIsExpired = (token) => {
      if (!token) return true;
      const decoded = jwtDecode(token);
      return decoded.exp < (Date.now() / 1000);
    };

    const ensureValidToken = async () => {
      if (tokenIsExpired(authToken)) {
        await refreshTokenFunc();
      }
    };

    const fetchUserProfileAndResources = async () => {
      await ensureValidToken(); // Ensure token is valid before making API calls

      try {
        const [profileResponse, resourcesResponse] = await Promise.all([
          axios.get(`${backendURL}/api_user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          facultyId ? axios.get(`${backendURL}/api_resource/faculty/${facultyId}`) : Promise.resolve({ data: { resource_list: [] } }),
        ]);

        // Set user favorites using just the IDs for easy checking
        const favoriteIds = profileResponse.data.userFavorites.map(fav => fav.Resource._id);
        setUserFavorites(favoriteIds);

        // Set resources
        setResources(resourcesResponse.data.resource_list);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching data.');
      }
    };

    fetchUserProfileAndResources();
  }, [facultyId, authToken, refreshTokenFunc, backendURL]);

  const isResourceFavorited = resourceId => userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  const toggleFavorite = async (resourceId) => {
    const isAlreadyFavorited = userFavorites.includes(resourceId);
    
    try {
      if (isAlreadyFavorited) {
        // Send a DELETE request to unfavorite the resource
        await axios.delete(`${backendURL}/api/resources/${resourceId}/unfavorite`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        // Update the userFavorites state to remove the unfavorited resource
        setUserFavorites(currentFavorites => currentFavorites.filter(id => id !== resourceId));
      } else {
        // Send a POST request to favorite the resource
        await axios.post(`${backendURL}/api/resources/${resourceId}/favorite`, {}, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        // Update the userFavorites state to add the new favorite resource
        setUserFavorites(currentFavorites => [...currentFavorites, resourceId]);
      }
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

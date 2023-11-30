import React, { useState, useEffect, useContext } from 'react';
<<<<<<< Updated upstream
import DocumentCard from './DocumentCard'; 
=======
import DocumentCard from './DocumentCard';
>>>>>>> Stashed changes
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const FacultyPage = () => {
  const [resources, setResources] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const backendURL = 'http://localhost:3002';
  const { facultyId } = useParams();
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
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

    const fetchResources = async () => {
      try {
<<<<<<< Updated upstream
        const resourcesResponse = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(resourcesResponse.data.resource_list);
=======
        const response = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(response.data.resource_list);
>>>>>>> Stashed changes
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching resources.');
      }
    };

<<<<<<< Updated upstream
    if (authToken) {
      fetchUserProfile();
      fetchResources();
    }
  }, [facultyId, authToken, backendURL]);
=======
    fetchResources();
  }, [facultyId]);
>>>>>>> Stashed changes

  const isResourceFavorited = resourceId => userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Resources for Faculty</h1>
<<<<<<< Updated upstream
      {resources.length > 0 ? (
        resources.map(resource => (
          <DocumentCard 
            key={resource._id} 
            document={resource} 
            onClick={() => handleCardClick(resource._id)}
            isFavorited={isResourceFavorited(resource._id)} // Pass the favorited status
          />
        ))
      ) : (
        <p>No resources found for this faculty.</p>
      )}
=======
      <div className="faculty-container">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <DocumentCard key={resource._id} document={resource} onClick={() => handleCardClick(resource._id)} />
          ))
        ) : (
          <p>No resources found for this faculty.</p>
        )}
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default FacultyPage;

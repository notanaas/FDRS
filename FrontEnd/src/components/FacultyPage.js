import React, { useState, useEffect, useContext } from 'react';
import DocumentCard from './DocumentCard';
import axios from 'axios';
import { useParams, useHistory,useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';
import {jwtDecode} from 'jwt-decode'; 
import { CSSTransition } from 'react-transition-group';

const FacultyPage = () => {
  const { setRouteParams } = useContext(RouteParamsContext);
  const location = useLocation();
const facultyName = location.state?.facultyName || 'Faculty'; 
const [resources, setResources] = useState([]);
const [userFavorites, setUserFavorites] = useState([]);
const [error, setError] = useState('');
const history = useHistory();
const backendURL = 'http://localhost:3002';
const { facultyId } = useParams();
const { authToken, refreshTokenFunc } = useContext(AuthContext);



const facultyImageFilename = facultyName.toLowerCase().replace(/ /g, '-');

// Construct the background image URL
const backgroundImage = `/images/${facultyImageFilename}.png`;
const pageStyle = {
  backgroundImage: `url(${backgroundImage})`,
  // backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '100vh',
  transform: 'scale(1.0)',
  backgroundAttachment: 'fixed',

};
  useEffect(() => {
    setRouteParams({ facultyId });
  }, [facultyId, setRouteParams]);


  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesResponse = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(resourcesResponse.data.resource_list);
      } catch (err) {
        console.error('Error fetching faculty resources:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching resources.');
      }
    };

    fetchResources();
  }, [facultyId, backendURL]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (authToken) {
        try {
          const profileResponse = await axios.get(`${backendURL}/api_user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUserFavorites(profileResponse.data.userFavorites.map(fav => fav.Resource._id));
        } catch (err) {
          console.error('Error fetching user favorites:', err);
        }
      }
    };

    if (authToken) {
      fetchFavorites();
    }
  }, [authToken, backendURL]);

  const isResourceFavorited = resourceId => authToken && userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  const toggleFavorite = async (resourceId) => {
    // Refresh token if needed
    if (jwtDecode(authToken).exp < Date.now() / 1000) {
      await refreshTokenFunc();
    }
    const isAlreadyFavorited = userFavorites.includes(resourceId);
    const endpoint = isAlreadyFavorited ? 'unfavorite' : 'favorite';
    const method = isAlreadyFavorited ? axios.delete : axios.post;

    try {
      await method(`${backendURL}/api/resources/${resourceId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setUserFavorites(currentFavorites => isAlreadyFavorited
        ? currentFavorites.filter(id => id !== resourceId)
        : [...currentFavorites, resourceId]);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CSSTransition in={true} appear={true} timeout={300} classNames="fade">
      <div style={pageStyle} className="faculty-page">
        <div className='ResourcesfacultyName'>
        <h1>Resources for {facultyName}</h1>
        </div>
        <div className="faculty-container">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <DocumentCard
                cardType="faculty"
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
    </CSSTransition>
  );
};


export default FacultyPage;

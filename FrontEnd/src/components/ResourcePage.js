import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import { CSSTransition } from 'react-transition-group';
import './ResourcePage.css';

const ResourcePage = () => {
  const { resourceId } = useParams();
  const [resourceDetails, setResourceDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const { authToken, isLoggedIn, user, isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited);
  const history = useHistory();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setDarkMode(mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);
  useEffect(() => {
    setInProp(true);
  }, []);
  useEffect(() => {
    if (authToken && resourceId) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`${backendURL}/api_user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const isDocFavorited = response.data.userFavorites.some(fav => fav.Resource._id === resourceId);
          setIsFavorited(isDocFavorited);
        } catch (error) {
          console.error(`Error fetching favorites: ${error}`);
        }
      };

      fetchFavorites();
    }
  }, [authToken, resourceId]);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_resource/resource-detail/${resourceId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResourceDetails(response.data.Resource_details);
        setIsFavorited(response.data.Resource_details.isFavorited); // assuming your backend sends this information
        if (response.data.comments) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error('Error fetching resource details:', error);
      }
    };

    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId, authToken]);
  if (!document) return null;

  if (!resourceDetails) {
    return <div className="center">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>;
  }
  const promptLogin = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 4000); // Hide prompt after 4 seconds
  };
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }

    const action = isFavorited ? 'unfavorite' : 'favorite';
    try {
      const method = isFavorited ? 'delete' : 'post';  // Use delete for unfavorite
      const response = await axios[method](`${backendURL}/api_favorite/resources/${resourceId}/${action}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error(`Error toggling favorite status: ${error}`);
    }
  };


  const handleFavButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    toggleFavorite();
  };

  return (
    <CSSTransition in={inProp} timeout={300} classNames="fade" appear>
      <div className="resource-container">
        <div className="resource-header">
          {resourceDetails.Cover && (
            <img 
              src={`${backendURL}/api_resource/cover/${resourceId}`} 
              alt={resourceDetails.Title || "Resource cover"} 
              className="resource-cover-img" 
            />
          )}
          <h1>{resourceDetails.Title}</h1>
          <p className="author">Author: {`${resourceDetails.Author_first_name} ${resourceDetails.Author_last_name}`}</p>
          <p className="description">{resourceDetails.Description}</p>
          <p className="faculty"><strong>Faculty:</strong> {resourceDetails.Faculty.FacultyName}</p>
          <p className="created-at"><strong>Created At:</strong> {new Date(resourceDetails.created_at).toLocaleDateString()}</p>
          <p className="user-email">{resourceDetails.User.Email}</p>

        </div>

        <div className="resource-actions">
          <a 
            href={`${backendURL}/api_resource/download/${resourceId}`} 
            target='_blank' 
            rel="noopener noreferrer" 
            className="downloadButton"
          >
            Download
          </a>
          <button 
            className={`favorite-button ${isFavorited ? 'active' : ''}`} 
            onClick={handleFavButtonClick}
          >
            {isFavorited ? '★' : '☆'}
            {showLoginPrompt && <span className="login-tooltip">Log in to add</span>}
          </button>
        </div>

        <Comments resourceId={resourceId} userId={user?._id} isLoggedIn={isLoggedIn} isAdmin={isAdmin} authToken={authToken} />
      </div>
    </CSSTransition>
  );
};

export default ResourcePage;

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import './ResourcePage.css';

const ResourcePage = () => {
  const { resourceId } = useParams(); 
  const [resourceDetails, setResourceDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const { authToken, isLoggedIn, user,isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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
    <div className="resource-page">
      <section className="resource-header">
        {resourceDetails.Cover && (
          <div className="resource-cover">
            <img src={`${backendURL}/api_resource/cover/${resourceId}`} alt={resourceDetails.Title || "Document cover"} className="document-cover" />
          </div>
        )}
        <div className="resource-details">
          <h1 className="resource-title">{resourceDetails.Title}</h1>
          <p className="author"><strong>Author:</strong> {`${resourceDetails.Author_first_name} ${resourceDetails.Author_last_name}`}</p>
          <p className="description"><strong>Description:</strong> {resourceDetails.Description}</p>
          <p className="faculty"><strong>Faculty:</strong> {resourceDetails.Faculty.FacultyName}</p>
          <p className="file-size"><strong>File Size:</strong> {resourceDetails.file_size} bytes</p>
          <p className="created-at"><strong>Created At:</strong> {new Date(resourceDetails.created_at).toLocaleDateString()}</p>
          <p className="user-email">{resourceDetails.User.Email}</p>

          <a onClick={(e) => {e.stopPropagation();}} href={`${backendURL}/api_resource/download/${resourceId}`} target='_blank' className="authButton">Download</a>
          <button className="favorite-button" onClick={handleFavButtonClick}>
              {isFavorited ? '\u2605' : '\u2606'}
          </button>
        </div>
      </section>
      <Comments resourceId={resourceId} userId={user?._id} isLoggedIn={isLoggedIn} isAdmin={isAdmin} authToken={authToken} />
    </div>

  );
};

export default ResourcePage;

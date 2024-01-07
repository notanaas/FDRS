import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import { CSSTransition } from 'react-transition-group';
import Header from './Header';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';

import './ResourcePage.css';

const ResourcePage = () => {
  const { resourceId } = useParams();
  const [resourceDetails, setResourceDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const { authToken, isLoggedIn, user, isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';  const [isFavorited, setIsFavorited] = useState(document?.isFavorited);
  const history = useHistory();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [loading, setLoading] = useState(true);
  const shareUrl = window.location.href;
  const title = 'Check out this resource!';
  const [errorMessage, setErrorMessage] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);
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
        setLoading(true); ///////////

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
      finally {
        setLoading(false); 
      }
    };

    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId, authToken]);
  if (!document) return null;

  if (!resourceDetails) {
    return <div>
      <Header isLoading={loading} /> 
    </div>;
  }
  const setMessageWithTimer = (successMsg, errorMsg) => {
    setActionSuccess(successMsg);
    setActionError(errorMsg);
    clearTimeout(messageTimeout);
    const newTimeout = setTimeout(() => {
        setActionSuccess('');
        setActionError('');
    }, 3000);
    setMessageTimeout(newTimeout);
};
const resetMessages = () => {
  setActionSuccess('');
  setActionError('');
};
const toggleFavorite = async () => {
  resetMessages();
  if (!isLoggedIn) {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 4000);
    return;
  }
  const action = isFavorited ? 'unfavorite' : 'favorite';
  try {
    const method = isFavorited ? 'delete' : 'post';
    await axios[method](`${backendURL}/api_favorite/resources/${document._id}/${action}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setMessageWithTimer(`Resource has been ${isFavorited ? 'removed from' : 'added to'} favorites.`, '');
    setIsFavorited(!isFavorited);
  } catch (error) {
    setMessageWithTimer('', 'Failed to update favorite status.');
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
  
  const copyToClipboard = () => {
    const url = window.location.href; 
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
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
        
        <div className="share-buttons">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <button className='btncopy' onClick={copyToClipboard}>Copy Link</button>
        <LinkedinShareButton url={shareUrl}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
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
          <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
                  {isFavorited ? '\u2605' : '\u2606'}
                </button>
                {showLoginPrompt && (
                  <div className="error-message">Please log in to add to favorites.</div>
                )}

        </div>

        <Comments resourceId={resourceId} userId={user?._id} isLoggedIn={isLoggedIn} isAdmin={isAdmin} authToken={authToken} />
      </div>
    </CSSTransition>
  );
};

export default ResourcePage;

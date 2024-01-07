import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './DocumentCard.css';

const DocumentCard = ({ cardType, document, onClick, deleteFeedback, sendEmail, onDelete }) => {
  const [documents, setDocuments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited || false);
  const { authToken, isLoggedIn } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';  const [feedbacks, setFeedbacks] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);
  useEffect(() => {
    if (authToken && document && document._id) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`${backendURL}/api_user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const isDocFavorited = response.data.userFavorites.some(fav => fav.Resource._id === document._id);
          setIsFavorited(isDocFavorited);
        } catch (error) {
          console.error(`Error fetching favorites: ${error}`);
        }
      };

      fetchFavorites();
    }
  }, [authToken, document]);
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

useEffect(() => {
    return () => {
        clearTimeout(messageTimeout);
    };
}, [messageTimeout]);

  if (!document) return null;
  const goToResourceDetail = () => {
    history.push(`/resource/${document._id}`);
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

  const authorizeResource = async (resourceId) => {
    try {
      const response = await axios.post(`${backendURL}/api_user/admin/acceptance/${resourceId}`,
        { accept: true },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc._id !== resourceId));
      }
    } catch (error) {
      console.error('Error authorizing the resource:', error);
    }
  };
  const unauthorizeResource = async (resourceId) => {
    try {
      const response = await axios.post(`${backendURL}/api_user/admin/acceptance/${resourceId}`,
        { accept: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc._id !== resourceId));
      }
    } catch (error) {
      console.error('Error unauthorizing the resource:', error);
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
  const cardClassName = "card"; // This is the new class name for all card types

  
  
  const handleDelete = async () => {
    resetMessages();
    try {
      await onDelete(document._id);
      setMessageWithTimer('Resource deleted successfully.', '');
    } catch (error) {
      setMessageWithTimer('Failed to delete resource.');
    }
  };
  const handleDeleteFeedback = async (e, feedbackId) => {
    e.stopPropagation();
    try {
        await deleteFeedback(feedbackId);
        setMessageWithTimer('Feedback deleted successfully.', '');
    } catch (error) {
        setMessageWithTimer('', 'Failed to delete feedback.');
    }
};

  
  const handleSendEmail = (e, emailAddress) => {
    e.stopPropagation(); // Prevent event bubbling
    sendEmail(emailAddress);
  };
  
  
    const stopPropagation = (e) => e.stopPropagation();
    const CardContent = () => {
      const cardStyle = {
        backgroundImage: `url(${backendURL}/api_resource/cover/${document._id})`
      };
    
    
    
    switch (cardType) {
      case 'adminActions':
        return (
          <div className="card" style={cardStyle} onClick={goToResourceDetail}>
      <div className="card-content">
        <h3 className="card-title">{document.Title || "Untitled"}</h3>
             
              <h3>Faculty: {document.Faculty?.FacultyName || "No faculty name provided"}</h3>
              <h3 className="card-uploader">Uploader: {document.User.Email}</h3>
            </div>
            <div className="card-description">
              <a onClick={stopPropagation} href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="downloadButton">
                <span>
                  Download
                </span>
              </a>
              <button onClick={(e) => { stopPropagation(e); authorizeResource(document._id); }} className="authButton">
                Authorize
              </button>
              <button onClick={(e) => { stopPropagation(e); unauthorizeResource(document._id); }} className="authButton">
                Unauthorize
              </button>
            </div>
          </div>
        );

        case 'resource':
          return (
            <div className="card" style={cardStyle} onClick={goToResourceDetail}>
            <div className="card-content">
              <h3 className="card-title">{document.Title || "Untitled"}</h3>
              </div>
              <div className="card-description">
                <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="downloadButton">Download</a>
                {onDelete && (
             <button className="trashButton" onClick={(e) => { e.stopPropagation(); onDelete(document._id); }}>
             🗑️ 
         </button>
         
            )}
</div>
            </div>
          );
      case 'favorite':
        return (
          <div className="card" style={cardStyle} onClick={goToResourceDetail}>
      <div className="card-content">
        <h3 className="card-title">{document.Title || "Untitled"}</h3>
            </div>
            <div className="card-description">
              <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="downloadButton">Download</a>
              <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
                {isFavorited ? '\u2605' : '\u2606'}
              </button>
            </div>
          </div>
        );

        case 'faculty':
          return (
            <div className="card" style={cardStyle} onClick={goToResourceDetail}>
              <div className="card-content">
                <h3 className="card-title">{document.Title || "Untitled"}</h3>
                <h3 className="card-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</h3>
              </div>
              <div className="card-description">
                {document.Description || "No description provided"}
                <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
                  {isFavorited ? '\u2605' : '\u2606'}
                </button>
                {showLoginPrompt && (
                  <div className="error-message">Please log in to add to favorites.</div>
                )}
              </div>
            </div>
          );
        
        case 'feedback':
          return (
            <div  className="feedbackcard"onClick={(e) => e.stopPropagation()}> 
              <div>
                <h3><strong>Email:</strong> {document.User.Email}</h3>
                <h3><strong>Feedback:</strong> {document.SearchText}</h3>
                <div>
                  <button 
                    className="authButton" 
                    onClick={(e) => handleDeleteFeedback(e, document._id)}>
                    Delete Feedback
                  </button>
                  <button 
                    className="authButton" 
                    onClick={(e) => handleSendEmail(e, document.User.Email)}> 
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          );
          case 'search':
      return (
        <div className="card search-card" style={cardStyle} onClick={goToResourceDetail}>
          <div className="card-content">
            <h3 className="card-title">{document.Title || "Untitled"}</h3>
            <p className="card-author">Author: {document.Author_first_name} {document.Author_last_name}</p>
          </div>
          <div className="card-description">
            {document.Description || "No description provided"}
            <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
                {isFavorited ? '\u2605' : '\u2606'}
                {showLoginPrompt && (
                  <span className="login-tooltip">Log in to add</span>
                )}
              </button>
          </div>
          </div>
      );
      default:
        return null;
    }
  };

  return (
<div>
    {actionSuccess && <div className="success-message">{actionSuccess}</div>}
    {actionError && <div className="error-message">{actionError}</div>}
    <CardContent onDelete={handleDelete} />


    </div>
  );

};

export default DocumentCard;

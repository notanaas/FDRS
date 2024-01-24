import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import './DocumentCard.css';

const DocumentCard = ({ cardType, document, onClick, deleteFeedback, sendEmail, onDelete }) => {
  const [documents, setDocuments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited || false);
  const { authToken, isLoggedIn } = useContext(AuthContext);
  const backendURL = 'https://fdrs-backend.up.railway.app'; const [feedbacks, setFeedbacks] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [authorizationMessage, setAuthorizationMessage] = useState('');
  const [isAuthorizationMessageVisible, setIsAuthorizationMessageVisible] = useState(false);


  const handleConfirmDelete = async () => {
    try {
      await onDelete(document._id);
      setMessageWithTimer('Resource deleted successfully.', '');
    } catch (error) {
      setMessageWithTimer('Failed to delete resource.');
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

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
  
    if (!document || !document._id) {
      console.error('Document ID is undefined.');
      setMessageWithTimer('', 'Failed to update favorite status. Document ID is missing.');
      return;
    }
  
    const action = isFavorited ? 'unfavorite' : 'favorite';
    const method = isFavorited ? 'delete' : 'post';
  
    try {
      const response = await axios[method](`${backendURL}/api_favorite/resources/${document._id}/${action}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      if (response.status === 200 || response.status === 201) {
        setMessageWithTimer(`Resource has been ${isFavorited ? 'removed from' : 'added to'} favorites.`, '');
        setIsFavorited(!isFavorited);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
      setMessageWithTimer('', 'Failed to update favorite status.');
    }
  };
  
  

  const showAuthorizationMessage = (message) => {
    setAuthorizationMessage(message);
    setIsAuthorizationMessageVisible(true);
    setTimeout(() => {
      setIsAuthorizationMessageVisible(false);
    }, 5000); // Hide the message after 5 seconds
  };

  const authorizeResource = async (resourceId) => {
    try {
      const response = await axios.post(
        `${backendURL}/api_user/admin/acceptance/${resourceId}`,
        { accept: true },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('Authorize response:', response); // Debugging log
      if (response.status === 200) {
        showAuthorizationMessage('Resource successfully authorized.');
        // Remove the document from the state to update the UI
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc._id !== resourceId));
      }
    } catch (error) {
      console.error('Error authorizing the resource:', error);
      showAuthorizationMessage('Failed to authorize the resource. Please try again later.');
    }
  };
  
  const unauthorizeResource = async (resourceId) => {
    try {
      const response = await axios.post(
        `${backendURL}/api_user/admin/acceptance/${resourceId}`,
        { accept: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('Unauthorize response:', response); // Debugging log
      if (response.status === 200) {
        showAuthorizationMessage('Resource successfully unauthorized.');
        // Remove the document from the state to update the UI
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc._id !== resourceId));
      }
    } catch (error) {
      console.error('Error unauthorizing the resource:', error);
      showAuthorizationMessage('Failed to unauthorize the resource. Please try again later.');
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


    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
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
            <div>
              {actionSuccess && <div className="success-message">{actionSuccess}</div>}
              {actionError && <div className="error-message">{actionError}</div>}
              <div className="card" style={cardStyle} onClick={goToResourceDetail}>
                <div className="card-description">
                  <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="downloadButton">Download</a>
                  <button className="trashButton" onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}>
                    🗑️
                  </button>
                </div>
              </div>
        
              {showConfirmation && (
                <DeleteConfirmationModal
                  onCancel={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              )}
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
  <div className="card-description-text">
    {truncateText(document.Description || "No description provided", 200)}
  </div>
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
          <div className="feedbackcard" onClick={(e) => e.stopPropagation()}>
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
      {isAuthorizationMessageVisible && (
          <div className="authorization-message">{authorizationMessage}</div>
        )}
      {actionSuccess && <div className="success-message">{actionSuccess}</div>}
      {actionError && <div className="error-message">{actionError}</div>}
      <CardContent onDelete={handleDelete} />


    </div>
  );

};

export default DocumentCard;

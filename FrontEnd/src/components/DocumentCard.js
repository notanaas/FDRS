import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './DocumentCard.css';

const DocumentCard = ({item ,document, onClick, showAdminActions, isFeedback, deleteFeedback, sendEmail }) => {

  const [feedbacks, setFeedbacks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited || false);
  const { authToken, isLoggedIn } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const isProfilePage = location.pathname.includes(`/my-profile`);
 const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setDarkMode(mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (authToken&&document&&document._id) {
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
  if (!document) return null;
  const goToResourceDetail = () => {
    history.push(`/resource/${document._id}`);
  };
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }

    const action = isFavorited ? 'unfavorite' : 'favorite';
    try {
      await axios.post(`${backendURL}/api_favorite/resources/${document._id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error(`Error toggling favorite status: ${error}`);
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




  const FeedbackCardContent = ({ item, isProfilePage, deleteFeedback, sendEmail }) => {
    return (
      isProfilePage && (
        <div className="feedback-card-content">
          <p><strong>Email:</strong> {item.userEmail}</p>
          <p><strong>Feedback:</strong> {item.searchText}</p>
          <div className="feedback-actions">
          <button className="authButton"onClick={(e) => {e.stopPropagation(); deleteFeedback(item._id);}}>
      Delete Feedback
    </button>
            <button onClick={() => sendEmail(item.userEmail)} className="authButton">
              Send Email
            </button>
          </div>
        </div>
      )
    );
  };
  const handleFavButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    toggleFavorite();
    };


  const CardContent = () => (
    !isFeedback && (

      <div className='document-card' onClick={onClick}>
        <img src={`${backendURL}/api_resource/cover/${document._id}`} alt={document.Title || "Document cover"} className="document-cover" />
        <div className="document-info">
          <h3 className="document-title">{document.Title || "Untitled"}</h3>
          <p className="document-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</p>
          <p className="document-description">Description: {document.Description || "No description provided."}</p>
          {!isFeedback && <p>Faculty: {document.Faculty?.FacultyName || "No faculty name provided"}</p>}
          <p className="document-uploader">Uploader: {document.User.Email}</p>
        </div>
        <div className="document-actions">
          <a onClick={(e) => { e.stopPropagation(); }} href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="authButton">Download</a>
          {showLoginPrompt && (
        <div className="login-prompt">You need to be logged in to add to favorites.</div>
      )}
          {isFacultyPage && (
          <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
          {isFavorited ? '\u2605' : '\u2606'}
            </button>
          )}

          {showAdminActions && (

            <>
              <button onClick={(e) => { e.stopPropagation(); authorizeResource(document._id); }} className="authButton">Authorize</button>
              <button onClick={(e) => { e.stopPropagation(); unauthorizeResource(document._id); }} className="authButton">Unauthorize</button>
            </>
          )}
        </div>
      </div>
    )
  );


  return (
    <div className={`card ${darkMode ? 'dark-mode' : 'light-mode'} ${isFacultyPage && !isFeedback ? 'clickable' : ''}`} onClick={isFacultyPage && !isFeedback ? goToResourceDetail : undefined}>
    {isFeedback ? 
        <FeedbackCardContent 
        item={item}
        isProfilePage={isProfilePage}
        deleteFeedback={deleteFeedback}
        sendEmail={sendEmail}
      />
      
        : 
        <CardContent />
      }
    </div>
  );
  
};

export default DocumentCard;

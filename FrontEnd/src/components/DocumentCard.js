import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './DocumentCard.css';

const DocumentCard = ({cardType ,document, onClick, deleteFeedback, sendEmail ,item}) => {

  
  const [documents, setDocuments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isFavorited, setIsFavorited] = useState(document?.isFavorited || false);
  const { authToken, isLoggedIn } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [feedbacks, setFeedbacks] = useState([]);

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
      const method = isFavorited ? 'delete' : 'post';  // Use delete for unfavorite
    const response = await axios[method](`${backendURL}/api_favorite/resources/${document._id}/${action}`, {
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
  
  const handleFavButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    toggleFavorite();
    };

    const CardContent = () => {

      switch (cardType) {
        case 'adminActions':
          return (
            <div className='document-card' onClick={onClick}>
         <img  src={`${backendURL}/api_resource/cover/${document._id}`}  alt={document.Title || "Document cover"}  className="document-cover"  />
          <div className="document-info">
          <h3 className="document-title">{document.Title || "Untitled"}</h3>
          <p className="document-author">
            Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}
          </p>
          <p>Faculty: {document.Faculty?.FacultyName || "No faculty name provided"}</p>
          <p className="document-uploader">Uploader: {document.User.Email}</p>
        </div>
        <div className="document-actions">
          <a 
            onClick={(e) => { e.stopPropagation(); }} 
            href={`${backendURL}/api_resource/download/${document._id}`} 
            target='_blank' 
            className="authButton"
          >
            Download
          </a>
          <button onClick={(e) => { e.stopPropagation(); authorizeResource(document._id); }} className="authButton">
            Authorize
          </button>
          <button onClick={(e) => { e.stopPropagation(); unauthorizeResource(document._id); }} className="authButton">
            Unauthorize
          </button>             
          </div>
            </div>
          );
  
        case 'resource':
          return (
            <div className='document-card' onClick={onClick}>
              <img src={`${backendURL}/api_resource/cover/${document._id}`} alt={document.Title || "Document cover"} className="document-cover" />
              <div className="document-info">
                <h3 className="document-title">{document.Title || "Untitled"}</h3>
                <p className="document-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</p>
              </div>
              <div className="document-actions">
                <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="authButton">Download</a>
               
              </div>
            </div>
          );
        case 'favorite':
          return (
            <div className='document-card' onClick={onClick}>
              <img src={`${backendURL}/api_resource/cover/${document._id}`} alt={document.Title || "Document cover"} className="document-cover" />
              <div className="document-info">
                <h3 className="document-title">{document.Title || "Untitled"}</h3>
                <p className="document-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</p>
              </div>
              <div className="document-actions">
                <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="authButton">Download</a>
                <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
          {isFavorited ? '\u2605' : '\u2606'}
            </button>
              </div>
            </div>
          );
  
        case 'faculty':
          return (
            <div className='document-card' onClick={onClick}>
            <img src={`${backendURL}/api_resource/cover/${document._id}`} alt={document.Title || "Document cover"} className="document-cover" />
            <div className="document-info">
              <h3 className="document-title">{document.Title || "Untitled"}</h3>
              <p className="document-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</p>
            </div>
            <div className="document-actions">
              <a href={`${backendURL}/api_resource/download/${document._id}`} target='_blank' className="authButton">Download</a>
              <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleFavButtonClick(); }}>
          {isFavorited ? '\u2605' : '\u2606'}
            </button>
            </div>
          </div>
          );
          case 'feedback':
            return (
              <div className='feedback-card'>
                <div className="feedback-card-content">
                <p><strong>Email:</strong> {document.User.Email}</p>
               <p><strong>Feedback:</strong> {document.SearchText}</p>
                  <div className="feedback-actions">
                    <button className="authButton" onClick={(e) => {e.stopPropagation(); deleteFeedback(document._id);}}>
                      Delete Feedback
                    </button>
                    <button onClick={() => sendEmail(document.User.Email)} className="authButton">
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            );
        default:
          return null;
      }
    };

  return (
    <div >
   
        
        <CardContent />
      
    </div>
  );
  
};

export default DocumentCard;

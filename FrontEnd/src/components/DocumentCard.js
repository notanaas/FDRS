import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './App.css';

const DocumentCard = ({ document, onClick, showAdminActions }) => {
  const [isFavorited, setIsFavorited] = useState(document.isFavorited);
  const { authToken } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [documents, setDocuments] = useState([]); 
  const location = useLocation();
  const history = useHistory();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  
  const goToResourceDetail = () => {
    history.push(`/resource/${document._id}`);
  };
  const toggleFavorite = async () => {
    const action = isFavorited ? 'unfavorite' : 'favorite';
    try {
      await axios.post(`http://localhost:3002/api_favorite/resources/${document._id}/${action}`, {}, {
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
    
  const handleDownload = async () => {
    try {
      const url = `${backendURL}/api_resource/download/${document._id}`;
      console.log('Downloading file from URL:', url); 
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 200 && response.data) {
        const fileBlob = new Blob([response.data], { type: 'application/pdf' });
          if (fileBlob.size > 0) {
          const downloadUrl = window.URL.createObjectURL(fileBlob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = document.Title ? `${document.Title}.pdf` : 'document.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove(); 
          window.URL.revokeObjectURL(downloadUrl); 
        } else {
          console.error('Received empty Blob');
        }
      } else {
        console.error('Download failed', response.status, response.data);
      }
    } catch (error) {
      console.error('Error during download', error);
    }
  };
  
  
  if (!document || !document._id) {
    return <div className="document-card">This favorite resource is not available.</div>;
  }
  
  const CardContent = () => (
    <div onClick={onClick}>
      <img src={document.Cover} alt={document.Title || "Document cover"} className="document-cover" />
      <div className="document-info">
        <h3 className="document-title">{document.Title || "Untitled"}</h3>
        <p className="document-author">Author: {document.Author_first_name || "Unknown"} {document.Author_last_name || ""}</p>
        <p className="document-description">Description: {document.Description || "No description provided."}</p>
        <p>Faculty: {document.Faculty.FacultyName}</p>
        <p className="document-uploader">Uploader: {document.User.Email}</p>
      </div>
      <div className="document-actions">
        <button onClick={(e) => {e.stopPropagation(); handleDownload(document._id);}} className="authButton">Download</button>
        {isFacultyPage && (
          <button className="favorite-button"onClick={(e) => {e.stopPropagation();toggleFavorite();}}>
            {isFavorited ? '\u2605' : '\u2606'}
          </button>
        )}
        {showAdminActions && (
          <>
            <button onClick={(e) => {e.stopPropagation(); authorizeResource(document._id);}} className="authButton">Authorize</button>
            <button onClick={(e) => {e.stopPropagation(); unauthorizeResource(document._id);}} className="authButton">Unauthorize</button>
          </>
        )}
      </div>
    </div>
  );


  return (
    <div className={`document-card ${isFacultyPage ? 'clickable' : ''}`} onClick={isFacultyPage ? goToResourceDetail : undefined}>
    <CardContent />
  </div>
);
};

export default DocumentCard;

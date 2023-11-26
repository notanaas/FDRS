import React, { useState,useContext } from 'react';
import { useHistory,useLocation } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from './context/AuthContext';
import './App.css';


const DocumentCard = ({ document }) => {
  const { authToken } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [documents, setDocuments] = useState([]); 
  const location = useLocation();
  const history = useHistory();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const goToResourceDetail = () => {
    history.push(`/resource/${document._id}`);
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
    
  const handleDownload = async (documentId) => {
    try {
      const url = `${backendURL}/api_resource/download/${documentId}`;
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const file = new Blob([response.data], { type: 'application/pdf' });
      const downloadFileName = document.Title ? `${document.Title}.pdf` : 'document.pdf';
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = downloadFileName;
      document.body.appendChild(link); 
      link.click();
      document.body.removeChild(link); 
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  const CardContent = () => (
    <>
      <img src={document.Cover} alt="Document cover" className="document-cover" />
      <div className="document-info">
        <h3 className="document-title">{document.Title}</h3>
        <p className="document-author">Author: {document.Author_first_name} {document.Author_last_name}</p>
        <p className="document-description">Description: {document.Description}</p>
        <p>Faculty: {document.Faculty && document.Faculty.FacultyName ? document.Faculty.FacultyName : 'N/A'}</p>
      </div>
      <div className="document-actions">
        <button onClick={(e) => {e.stopPropagation(); handleDownload(document._id);}} className="authButton">Download</button>
        {!isFacultyPage && (
          <div>
            <button onClick={(e) => {e.stopPropagation(); authorizeResource(document._id);}} className="authButton">Authorize</button>
            <button onClick={(e) => {e.stopPropagation(); unauthorizeResource(document._id);}} className="authButton">Unauthorize</button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={`document-card ${isFacultyPage ? 'clickable' : ''}`} onClick={isFacultyPage ? goToResourceDetail : undefined}>
      <CardContent />
    </div>
  );
};
export default DocumentCard;

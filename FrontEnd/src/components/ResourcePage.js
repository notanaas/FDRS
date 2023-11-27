import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import './App.css';

const ResourcePage = () => {
  const { resourceId } = useParams(); 
  const [resourceDetails, setResourceDetails] = useState(null);
  const { authToken, isLoggedIn, userId } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api_resource/resource-detail/${resourceId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResourceDetails(response.data.Resource_details);
      } catch (error) {
        console.error('Error fetching resource details:', error);
      }
    };

    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId, authToken]);

  if (!resourceDetails) {
    return <div>Loading resource...</div>;
  }
  
  return (
    <div className="resource-page">
      <div className="resource-header">
        {resourceDetails.coverImageUrl && (
          <div className="resource-cover">
            <img src={resourceDetails.coverImageUrl} alt="Resource Cover" className="cover-image"/>
          </div>
        )}
        <div className="resource-details">
      <h1>{resourceDetails.Title}</h1>
      <p><strong>Author:</strong> {`${resourceDetails.Author_first_name} ${resourceDetails.Author_last_name}`}</p>
      <p><strong>Description:</strong> {resourceDetails.Description}</p>
      <p><strong>Faculty:</strong> {resourceDetails.Faculty.name}</p>
      <p><strong>File Size:</strong> {resourceDetails.file_size} bytes</p>
      <p><strong>Created At:</strong> {new Date(resourceDetails.created_at).toLocaleDateString()}</p>
      {resourceDetails.fileUrl && (
            <a href={`${backendURL}/download/${resourceDetails.id}`} download className="download-button">
              Download
            </a>
          )}
        </div>
      </div>
      {resourceDetails &&<Comments resourceId={resourceId} userId={userId} isLoggedIn={isLoggedIn} authToken={authToken} />}
    </div>
  );
};

export default ResourcePage;

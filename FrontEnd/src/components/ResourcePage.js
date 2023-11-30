import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import './App.css';

const ResourcePage = () => {
  const { resourceId } = useParams(); 
  const [resourceDetails, setResourceDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const { authToken, isLoggedIn, user,isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_resource/resource-detail/${resourceId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResourceDetails(response.data.Resource_details);
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
      <h3 className="document-title">{resourceDetails.User.Email}</h3>

      {resourceDetails.fileUrl && (
            <button href={`${backendURL}/download/${resourceDetails.id}`} download className="download-button">
              Download
            </button>
          )}
        </div>
      </div>
      <Comments resourceId={resourceId} userId={user?._id} isLoggedIn={isLoggedIn} isAdmin={isAdmin} authToken={authToken} />

    </div>
  );
};

export default ResourcePage;

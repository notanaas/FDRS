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
      {resourceDetails.fileUrl && (
        <a onClick={(e) => {e.stopPropagation();}} href={`${backendURL}/api_resource/download/${resourceId}`} target='_blank'  className="authButton">Download</a>
       
      )}
    </div>
  </section>
  <Comments resourceId={resourceId} userId={user?._id} isLoggedIn={isLoggedIn} isAdmin={isAdmin} authToken={authToken} />
</div>

  );
};

export default ResourcePage;

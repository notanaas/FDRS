import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import DocumentCard  from './DocumentCard'; // Ensure this is the correct path
import './MyProfile.css';
import { useHistory,useLocation } from 'react-router-dom';
import Accordion from './Accordion'; // Make sure to create this component


const MyProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', isAdmin: false });
  const [documents, setDocuments] = useState([]); 
  const { authToken, isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ username: '', email: '' });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const location = useLocation(); // This hook gets the current location object
  const history = useHistory();
  const isProfilePage = location.pathname.includes(`/my-profile`);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (isAdmin&&isProfilePage) { 
        try {
          const response = await axios.get(`${backendURL}/api_feedback/feedbacks`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setFeedbacks(response.data.feedbacks); // Set feedbacks in state
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
        }
      }
    };
  
    fetchFeedbacks();
  }, [authToken, isAdmin, backendURL]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data) {
        setProfile({
          username: response.data.profile.Username,
          email: response.data.profile.Email,
          isAdmin: response.data.profile.isAdmin,
        });
        setUserResources(response.data.UserResources);
        setUserFavorites(response.data.userFavorites);
        
   } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchUnauthorizedResources = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_user/resource/authorize`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDocuments(response.data.resource);
    } catch (error) {
      console.error('Error fetching unauthorized resources:', error);
      setErrorMessage('Error fetching unauthorized resources. Please try again.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };
  
  const handlePasswordResetRequest = async () => {
    try {
      const response = await axios.post(`${backendURL}/api_auth/forgot-password`, { email: profile.email }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSuccessMessage(response.data.message);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Password reset request error:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to request password reset.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };
 
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setEditedProfile({
        username: profile.username,
        email: profile.email,
      });
    } else {
      setEditedProfile({
        username: profile.username,
        email: profile.email,
      });
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    const updateData = {
      newUsername: editedProfile.username.trim(),
      newEmail: editedProfile.email.trim(),
    };

    try {
      const response = await axios.put(`${backendURL}/api_user/update_profile`, updateData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        setProfile(prev => ({
          ...prev,
          username: updateData.newUsername,
          email: updateData.newEmail,
        }));
        setSuccessMessage('Profile updated successfully.');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        setIsEditMode(false);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
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
  
  const handleCardClick = (resourceId) => {
    history.push(`/resource/${resourceId}`);
  };
  useEffect(() => {
    if (authToken) {
      fetchProfileData();
    }
    if (profile.isAdmin ) {
      fetchUnauthorizedResources();
    }
  }, [profile.isAdmin, authToken, backendURL]);
  if (!profile.username) {
    return <div>Loading...</div>;
  }

  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await axios.delete(`${backendURL}/api_feedback/delete-feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 200) {
        // Update the state to reflect the deletion
        setFeedbacks(currentFeedbacks => currentFeedbacks.filter(feedback => feedback._id !== feedbackId));
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      // Handle error (e.g., show error message)
    }
  };
  const sendEmail = (emailAddress) => {
    // Optionally, add subject and body to the email
    const subject = encodeURIComponent("Your Feedback");
    const body = encodeURIComponent("Thank you for your feedback!");
  
    // Construct the mailto link
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };
  
  return (
    <div className="my-profile">
      {showSuccessMessage && (
        <div className="success-message-header">{successMessage}</div>
      )}
      {showErrorMessage && (
        <div className="error-message-header">{errorMessage}</div>
      )}
      <h1>User Profile</h1>
      <Accordion title="User Profile Information">
      {isEditMode ? (
        <div className="edit-profile">
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" name="username" className="inputBar" placeholder="Enter new username" value={editedProfile.username} onChange={handleProfileChange} />
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" className="inputBar" placeholder="Enter new email" value={editedProfile.email} onChange={handleProfileChange} />
          <button className="authButton" onClick={handleProfileUpdate}>Save Changes</button>
          <button className="authButton" onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div className="user-info">
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <button className="authButton" onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="user-actions">
        <button className="authButton" onClick={handlePasswordResetRequest}>Change Password</button>
      </div>
      </Accordion>
      <div className="profile-sections">
      <Accordion title="Your Resources">

        <div className="user-resources section">
          <h2>Your Resources</h2>
          <div className="resources-list">
            {userResources.length > 0 ? (
              userResources.map((resource) => (
                <DocumentCard
                  key={`userResource-${resource._id}`} // Ensure the key is unique
                  document={resource}
                  showAdminActions={false}
                  onClick={() => handleCardClick(resource._id)}
                />

              ))
            ) : (
              <p>No resources available.</p>
            )}
          </div>
        </div>
        </Accordion>
        <div className="user-favorites section">
        <Accordion title="Your Favorites">

          <h2>Your Favorites</h2>
          <div className="favorites-list">
            {userFavorites.length > 0 ? (
              userFavorites.map((resource) => {
                const resourceData = resource.Resource;
                return resourceData ? (
                  <DocumentCard
                    key={`userFavorite-${resourceData._id}`} // Ensure the key is unique
                    document={resourceData}
                    showAdminActions={false}
                    onClick={() => handleCardClick(resourceData._id)}
                  />
        ) : (
          <p key={`favorite-error-${resource._id}`}>This favorite resource is not available.</p>
        );
      })
    ) : (
      <p>No favorites available.</p>
    )}
          </div>
          </Accordion>
        </div>
      </div>

      {profile.isAdmin && (
      <Accordion title="Admin Actions">

        <div className="admin-section">
          <h2>Unauthorized Documents</h2>
          <div className="documents-list">
              {documents.map((doc) => (
                <DocumentCard
                  key={`adminDocument-${doc._id}`} // Ensure the key is unique
                  document={doc}
                  onAuthorize={authorizeResource}
                  onUnauthorize={unauthorizeResource}
                  showAdminActions={true}
                />
            ))}
          </div>
        </div>
        <div className="feedbacks-section">
        <h2>Feedbacks</h2>
        <div className="feedbacks-container">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <DocumentCard
                    key={`feedback-${feedback._id}`} // Ensure the key is unique
                    item={{
                      _id: feedback._id,
                      userEmail: feedback.User.Email,
                      searchText: feedback.SearchText,
                    }}
                    isFeedback={true}
                    deleteFeedback={deleteFeedback}
                    sendEmail={sendEmail}
                  />
  
  ))
) : (
  <p>No feedbacks to display.</p>
)}
          </div>
            </div>
        </Accordion>
      )}

    </div>
  );
};

export default MyProfile;


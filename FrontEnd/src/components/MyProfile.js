import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import DocumentCard  from './DocumentCard'; // Ensure this is the correct path
import './App.css';

const MyProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', isAdmin: false });
  const [documents, setDocuments] = useState([]); 
  const { authToken } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ username: '', email: '' });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  
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
  useEffect(() => {
    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, backendURL]);

  useEffect(() => {
    if (profile.isAdmin) {
      fetchUnauthorizedResources();
    }
  }, [profile.isAdmin, authToken, backendURL]);

  
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
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
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
  
 
  if (!profile.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-profile">
      {showSuccessMessage && (
        <div className="success-message-header">{successMessage}</div>
      )}
      {showErrorMessage && (
        <div className="error-message-header">{errorMessage}</div>
      )}
      <h1>User Profile</h1>
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
      {profile.isAdmin && (
  <div className="admin-section">
    <h2>Unauthorized Documents</h2>
    <div className="documents-list">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc._id} 
          document={doc}
          onAuthorize={authorizeResource} 
          onUnauthorize={unauthorizeResource} 
        />
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default MyProfile;

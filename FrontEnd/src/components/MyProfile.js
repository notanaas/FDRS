import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './App.css';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    isAdmin: false,
  });
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { authToken } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    email: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  useEffect(() => {
    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, backendURL]);

  useEffect(() => {
    fetchDocuments();
  }, [selectedFaculty, authToken, backendURL]);
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Reset edited profile if the user cancels the edit
      setEditedProfile({
        username: profile.username,
        email: profile.email,
      });
    } else {
      // Initialize edit mode with current profile data
      setEditedProfile({
        username: profile.username,
        email: profile.email,
      });
      setSuccessMessage('');
      setErrorMessage('');
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
      alert(error.response?.data?.message || 'Failed to request password reset.');
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
          username: updateData.username,
          email: updateData.email,
        }));
        setSuccessMessage('Profile updated successfully.');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        setIsEditMode(false);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.data) {
        setProfile({
          username: response.data.profile.Username,
          email: response.data.profile.Email,
          isAdmin: response.data.profile.isAdmin
        });

        if (response.data.profile.isAdmin) {
          fetchFaculties();
        }
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchFaculties = async () => {
    setIsLoadingFaculties(true);
    try {
      const response = await axios.get(`${backendURL}/api_faculty/Faculties`);
      setFaculties(response.data.facultyNames || []);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
    } finally {
      setIsLoadingFaculties(false);
    }
  };

  const fetchDocuments = async () => {
    // Make sure to check for the selected faculty ID
    if (selectedFaculty && selectedFaculty._id) {
      setIsLoadingDocuments(true);
      try {
        const response = await axios.get(`${backendURL}/api_resource/resource_list/${selectedFaculty._id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setDocuments(response.data.Resource_list);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        setErrorMessage('Failed to fetch documents. Please try again.');
      } finally {
        setIsLoadingDocuments(false);
      }
    }
  };
  

  const setApprovalStatus = async (documentId, isApproved) => {
    // Use the correct backend endpoint and handle the response appropriately
    try {
      const response = await axios.put(`${backendURL}/api_user/admin_acceptance/${documentId}`, {
        accept: isApproved,
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.data.accepted) {
        setSuccessMessage('Resource accepted successfully');
      } else if (response.data.declined) {
        setSuccessMessage('Resource declined');
      }

      // Display success message for 5 seconds
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);

      fetchDocuments(); // Refetch documents to update the list
    } catch (error) {
      console.error('Error setting approval status:', error);
      setErrorMessage('Failed to set approval status. Please try again.');
      // Display error message for 5 seconds
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  

  const DocumentCard = ({ document }) => (
    <div className="document-card">
      <div className="document-image-container">
        {document.Cover ? (
          <img src={`${backendURL}/${document.Cover}`} alt="Document cover" className="document-image" />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      <div className="document-content">
        <h3 className="document-title">{document.ResourceTitle}</h3>
        <p className="document-author">Author: {document.ResourceAuthorFirstName} {document.ResourceAuthorLastName}</p>
        <a href={`${backendURL}/${document.file_path}`} download>Download Document</a> 
      </div>
      <div className="document-user-info">
        <p>Uploaded by: {document.uploaderUsername || 'Username not available'}</p>
        <p>Email: {document.uploaderEmail || 'Email not available'}</p>
      </div>
      <div className="document-actions">
        <button onClick={() => setApprovalStatus(document._id, true)} className="approve-button">Approve</button>
        <button onClick={() => setApprovalStatus(document._id, false)} className="disapprove-button">Disapprove</button>
      </div>
    </div>
  );

 

  if (!profile.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-profile">
      {showSuccessMessage && (
        <div className="success-message-header">
          {successMessage}
        </div>
      )}
    <h1>User Profile</h1>
    {isEditMode ? (
      <div className="edit-profile">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          className="inputBar"
          placeholder="Enter new username"
          value={editedProfile.username}
          onChange={handleProfileChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          className="inputBar"
          placeholder="Enter new email"
          value={editedProfile.email}
          onChange={handleProfileChange}
        />
        <button className="authButton" onClick={handleProfileUpdate}>Save Changes</button>
        <button  className="authButton" onClick={handleEditToggle}>Cancel</button>
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
          <h2>Admin Panel</h2>
          <div>
            <h3>Faculties</h3>
            {isLoadingFaculties ? (
              <p>Loading faculties...</p>
            ) : (
              faculties.map((faculty) => (
                <button
                  key={faculty._id}
                  className="authButton"
                  onClick={() => setSelectedFaculty(faculty)}
                >
                  {faculty.FacultyName}
                </button>
              ))
            )}
          </div>
          {selectedFaculty && (
            <div>
              <h3>Documents for Faculty: {selectedFaculty.FacultyName}</h3>
              {isLoadingDocuments ? (
                <p>Loading documents...</p>
              ) : (
                documents.map((document) => (
                  <DocumentCard key={document._id} document={document} />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MyProfile;

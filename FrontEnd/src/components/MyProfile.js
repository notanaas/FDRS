import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './App.css'; 

const MyProfile = () => {
  const backendURL = 'http://localhost:3002';
  const [user, setUser] = useState({ username: '', email: '' });
  const [showMessage, setShowMessage] = useState(false);
  const { triggerForgotPassword, authToken } = useContext(AuthContext); // Get authToken from AuthContext
  const [uploadedResources, setUploadedResources] = useState([]);
 
  const handleChangePassword = async () => {
    try {
      const response = await axios.post(`${backendURL}/api_auth/forgot-password`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${authToken}` }}); // Include authToken in request header
      console.log(response.data.message); // You can replace this with a state to display in the UI
      setShowMessage(true); // Show success message
      setTimeout(() => setShowMessage(false), 4000); // Hide message after 4 seconds
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token') || authToken;
      if (!token) {
        console.error("No auth token available.");
        return;
      }
    
      try {
        const response = await axios.get(`${backendURL}/api_user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        // Check if response data has profile and if profile has uploadedResources
        if (response.data && response.data.profile) {
          const userData = response.data.profile;
          setUser({
            username: userData.Username,
            email: userData.Email
          });
  
          if (userData.uploadedResources) {
            setUploadedResources(userData.uploadedResources);
          } else {
            console.log('No uploaded resources found for the user.');
          }
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
  }, [authToken]);
  

  return (
    <div className="my-profile">
      <h1>My Profile</h1>
      <div className="user-info">
        <h2>User Information</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <button onClick={handleChangePassword}>Change Password</button>
        {showMessage && <div className="email-sent-message">Check your email for password reset instructions</div>}
      </div>
      <div className="uploaded-resources">
        <h2>My Uploaded Resources</h2>
        {uploadedResources.map(resource => (
          <div key={resource._id}>
            <h3>{resource.Title}</h3>
            {/* Additional resource details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;

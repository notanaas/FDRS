import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './App.css'; 

const MyProfile = () => {
  const backendURL = 'http://localhost:3002';
  const [user, setUser] = useState({ username: '', email: '' });
  const [showMessage, setShowMessage] = useState(false);
  const { triggerForgotPassword, authToken } = useContext(AuthContext); // Get authToken from AuthContext

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
      // Handle error
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const authToken = localStorage.getItem('token'); // Get token from local storage
            const response = await axios.get(`${backendURL}/api_user/profile`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUser({
                username: response.data.profile.Username,
                email: response.data.profile.Email
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    fetchProfileData();
}, []);
  

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
      {/* Uploads and Favorites sections here */}
    </div>
  );
}

export default MyProfile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './App.css';

const PasswordReset = () => {
  const backendURL = 'http://localhost:3002';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const location = useLocation();
  const url = `${backendURL}/api_auth/post_reset-password/${userId}/${token}`;

  // Extract id and token from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userIdParam = queryParams.get('id');
    const tokenParam = queryParams.get('token');
    console.log('UserID:', userIdParam); // For debugging
    console.log('Token:', tokenParam); // For debugging
    if (userIdParam && tokenParam) {
      setUserId(userIdParam);
      setToken(tokenParam);
    }
  }, [location]);
  
  // Extract id and token from URL
  

  // ... rest of the imports and component

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
  
    try {
      // The URL here should match the POST route defined in your Express router
      const response = await axios.post(url, {
        password,
      });
      setMessage(response.data.message);
      // Redirect to login or other appropriate action
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setMessage(error.response.data.message || 'Failed to reset password. Please try again later.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setMessage('No response received. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setMessage('Error sending request. Please try again later.');
      }
    }
  };
  
  


  return (
    <div className="password-reset-container">
      <h1>Reset Your Password</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordReset;

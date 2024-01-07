import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import './App.css';

const PasswordReset = () => {
  const backendURL = 'https://fdrs-backend.up.railway.app';  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true); // State to track token validity
  const location = useLocation();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const url = `${backendURL}/api_auth/post_reset-password/${userId}/${token}`;
  const backgroundImage = `/my-profile.png`;
  useEffect(() => {
    const originalStyle = {
      overflow: document.body.style.overflow,
      backgroundImage: document.body.style.backgroundImage
    };

    // Apply styles
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';

    // Cleanup function to revert styles
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.backgroundImage = originalStyle.backgroundImage;
    };
  }, [backgroundImage]);
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length >= 4) {
      const userIdFromURL = pathSegments[2];
      const tokenFromURL = pathSegments[3];
      setUserId(userIdFromURL);
      setToken(tokenFromURL);

      // Decode the token
      try {
        const decodedToken = jwtDecode(tokenFromURL);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsTokenValid(false);
          setMessage("This password reset link has expired. Please request a new one.");
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsTokenValid(false);
        setMessage("Invalid token. Please check your link or request a new one.");
      }
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
  
    try {
      const response = await axios.post(url, {
        password,
      });
      setMessage(response.data.message);
      history.push('/WelcomingPage'); // Redirect to welcoming page after successful password reset
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Failed to reset password. Please try again later.');
      } else if (error.request) {
        setMessage('No response received. Please try again later.');
      } else {
        setMessage('Error sending request. Please try again later.');
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(true);
  
    setTimeout(() => {
      setShowPassword(false);
    }, 5000); 
  };
  
  return (
    <div className="upload-modal-content">
      <h1>Reset Your Password</h1>
      {message && <div className="message">{message}</div>}
      {!isTokenValid ? (
        <p>Token is invalid or expired. Please request a new password reset.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group1">
            <label className='input-Box' htmlFor="password">New Password:</label>
            <input
          type={showPassword ? "text" : "password"}
          placeholder='New Password:'
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={togglePasswordVisibility} className="password-toggle">
          {showPassword ? 'Hide' : 'Show'}
        </button>
          </div>
          <div className="form-group1">
            <label className='input-Box' htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              placeholder='Confirm New Password:'
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="authButton">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;

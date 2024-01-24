import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(''); // Add state for password error message
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState('');
  const passwordStrengthColors = {
    0: "transparent", // No strength
    1: "red",         // Weak
    2: "orange",      // Fair
    3: "yellowgreen", // Good
    4: "green"        // Strong
  };
  const url = `${backendURL}/api_auth/post_reset-password/${userId}/${token}`;
  const backgroundImage = `/WelcomingPage.png`;
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
  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    const criteria = {
      length: false,
      lowercase: false,
      specialChar: false,
    };
  
    if (password.length >= 8) {
      strength++;
      criteria.length = true;
    }
    if (/[a-z]/.test(password)) {
      strength++;
      criteria.lowercase = true;
    }
    if (/[!@#$%^&*]/.test(password)) {
      strength++;
      criteria.specialChar = true;
    }
  
    return { strength, criteria };
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Evaluate password strength
    const strengthEvaluation = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strengthEvaluation.strength);
    setPasswordCriteria(strengthEvaluation.criteria);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(''); // Clear any existing error messages
    setMessage(''); // Clear any existing messages

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(url, { password });
      setMessage(response.data.message);
      history.push('/WelcomingPage'); // Redirect after successful reset
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
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <div className="upload-modal-content">

        <h1>Reset Your Password</h1>
        {passwordError && <div className="error-message">{passwordError}</div>}
        {message && <div className="message">{message}</div>}
        {!isTokenValid ? (
        <p>Token is invalid or expired. Please request a new password reset.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group1">
            <label className='input-Box' htmlFor="password">New Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                name="password" 
                id="password"
                value={password}
                onChange={handlePasswordChange} 
                required
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
            <div className="password-strength-bar" style={{ backgroundColor: passwordStrengthColors[passwordStrength] }}>
              <div className="password-strength" style={{ width: `${passwordStrength * 25}%` }}></div>
            </div>
            <ul className="password-criteria">
              <li className={passwordCriteria.length ? 'met' : ''}>At least 8 characters</li>
              <li className={passwordCriteria.lowercase ? 'met' : ''}>1 lowercase character</li>
              <li className={passwordCriteria.specialChar ? 'met' : ''}>1 special character</li>
            </ul>
          </div>
            <div className="form-group1">
            <label className='input-Box' htmlFor="confirmPassword">Confirm New Password:</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </div>
            <button type="submit" className="authButton">Reset Password</button>
          </form>
        )}
      </div>
    );
  };
  
  export default PasswordReset;



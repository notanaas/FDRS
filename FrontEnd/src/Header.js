import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import './App.css';

const Header = ({ selectedFacultyName, onSearchChange, isFacultyPage, isAdmin }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setIsDarkMode(prefersDarkMode);

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const darkModeChangeListener = (e) => {
      setIsDarkMode(e.matches);

      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    darkModeMediaQuery.addEventListener('change', darkModeChangeListener);

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
    };
  }, []);

  const openSignupModal = () => {
    setIsSignupOpen(true);
    setModalTitle('Sign Up');
  };

  const closeSignupModal = () => {
    setIsSignupOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    const trimmedPassword = signupData.password.trim();
    const trimmedPasswordConfirm = passwordConfirm.trim();

    if (trimmedPassword !== trimmedPasswordConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }

    axios
      .post(`${backendURL}/api_auth/register`, signupData)
      .then((response) => {
        setSuccessMessage('Registration successful: ' + response.data.message);
        alert(response.data.message);
        closeSignupModal();
      })
      .catch((error) => {
        setErrorMessage('Registration failed: ' + error.response.data.errors[0].msg);
        console.error('Registration failed:', error.response.data.errors);
      });
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const checkLogin = (email, password) => {
    axios
      .post(`${backendURL}/api_auth/login`, { email, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        setSuccessMessage('Login successful');
        console.log('Login successful:', response.data);
        setLoginError('');
      })
      .catch((error) => {
        setLoginError('Email or password is incorrect');
        console.error('Login failed:', error.response.data);
      });
  };
  

  const backendURL = 'http://localhost:3000';

  const modalTitleStyle = {
    color: 'white',
  };

  return (
    <header className={`headerContainer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="logoContainer">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>

      <div>
        {isFacultyPage && (
          <div>
            <input
              type="text"
              className="searchBar"
              placeholder={`Search in `}
              onChange={onSearchChange}
            />
            <button className="searchButton">Search</button>
          </div>
        )}
      </div>

      <div className="authButtons">
        <form onSubmit={(e) => checkLogin(email, password)}>
          <input
            type="email"
            className="authInput"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            className="authInput"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit" className="authButton">
            Login
          </button>
        </form>
        <div className="authButtons">
          <button className="authButton" onClick={openSignupModal}>
            Sign Up
          </button>
        </div>
      </div>

      {loginError && <div className="error-message">{loginError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <Modal isOpen={isSignupOpen} onClose={closeSignupModal} isDarkMode={isDarkMode}>
        <h2 style={modalTitleStyle}>{modalTitle}</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSignupSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={signupData.username}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </Modal>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import './App.css';

const Header = ({
  selectedFacultyName,
  onSearchChange,
  isFacultyPage,
  isAdmin,
  userToken,
  setUserToken,
}) => {
  const backendURL = 'http://localhost:3000';
  const history = useHistory();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
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

  const handleForgotPassword = () => {
    history.push('/forgot-password');
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
        setUserToken(token); // Update the user's token in state
        setSuccessMessage('Login successful');
        console.log('Login successful:', response.data);
        setLoginError('');
      })
      .catch((error) => {
        setLoginError('Email or password is incorrect');
        console.error('Login failed:', error.response.data);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null); // Clear the user's token in state
    // Add any additional logout logic you need
  };

  const modalTitleStyle = {
    color: 'white',
  };
  
  const openForgotPasswordModal = () => {
    setIsForgotPasswordOpen(true);
    setModalTitle('Forgot Password');
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  
  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({
      ...forgotPasswordData,
      [name]: value,
    });
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${backendURL}/api_auth/forgot-password`, forgotPasswordData)
      .then((response) => {
        setSuccessMessage('An email with a password reset link has been sent.');
        closeForgotPasswordModal();
      })
      .catch((error) => {
        setErrorMessage('Password reset failed: ' + error.response.data.errors[0].msg);
        console.error('Password reset failed:', error.response.data.errors);
      });
  };

  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    checkLogin(email, password);
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
        {userToken ? (
          <div>
            <button className="authButton" onClick={handleLogout}>
              Logout
            </button>
            {isAdmin && (
              <Link to="/admin" className="admin-button">
                Admin Page
              </Link>
            )}
          </div>
        ) : (
          <div>
            <form onSubmit={handleLoginSubmit}>
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
            <button className="authButton" onClick={handleForgotPassword}>
              Forgot Password
            </button>
          </div>
        )}
      </div>

      <div className="authButtons" >
        <button className="authButton" onClick={openSignupModal}>
          Sign Up
        </button>
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
          <button type="submit" className="authButton">
            Sign Up
          </button>
        </form>
      </Modal>

      <Modal isOpen={isForgotPasswordOpen} onClose={closeForgotPasswordModal} isDarkMode={isDarkMode}>
        <h2 style={modalTitleStyle}>{modalTitle}</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleForgotPasswordSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={forgotPasswordData.email}
              onChange={handleForgotPasswordInputChange}
              required
            />
          </div>
          <button type="submit" className="authButton">
            Reset Password
          </button>
        </form>
      </Modal>
    </header>
  );
};

export default Header;

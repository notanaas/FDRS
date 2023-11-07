import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import axios from 'axios';
import './App.css';
const Sidebar = () => {
  return (
    <div className="sidebar" >
      <FacultyButtons />
    </div>
  );
}
const backendURL = 'http://localhost:3002';
const axiosInstance = axios.create({ baseURL: backendURL });
const Input = ({ type, id, name, value, onChange, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{placeholder}</label>
    <input type={type} id={id} name={name} className="inputBar" placeholder={placeholder} value={value} onChange={onChange} required />
  </div>
);

const Modal = ({ isOpen, onClose, children, isDarkMode }) => {
  const modalContentStyle = {
    backgroundColor: isDarkMode ? '#333' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="upload-modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }}></div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};
const Header = ({
  onSearchChange,
  isFacultyPage,
  isAdmin,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
  const [verificationCode, setVerificationCode] = useState(''); // New state for verification code
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState(''); 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [forgotPasswordErrorMessage, setForgotPasswordErrorMessage] = useState('');
  const [userToken, setUserToken] = useState(null);
  const { authToken, setAuthToken } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      setAuthToken(token); 
    }
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeChangeListener = (e) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', darkModeChangeListener);
    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
    };
  }, [setAuthToken])
  useEffect(() => {
    setIsLoggedIn(!!authToken);
  }, [authToken]);

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setVerificationCode('');
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setLoginError('');
  };

  const handleForgotPasswordInputChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, email: e.target.value });
  };
  const handleVerificationCodeChange = (e) => {
  setVerificationCode(e.target.value);
  };
  const closeSignupModal = () => {
    setIsSignupOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  const handleForgotPassword = () => {
    setPasswordResetEmail(email);
    setPassword('');
    setIsLoginModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleAPIError = (error) => {
    if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        setErrorMessage('Operation failed: ' + error.response.data.errors[0].msg);
        console.error('Operation failed:', error.response.data.errors);
    } else {
        setErrorMessage('Operation failed. Please try again later.');
        console.error('Operation failed:', error);
    }
  };
  const handleBackToLogin = () => {
    setPasswordResetEmail(false); // Clear the password reset email state
    setPassword(''); // Clear the password field
    setVerificationCode(''); // Clear the verification code field
    setIsForgotPasswordOpen(false);
    setIsLoginModalOpen(true);
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (passwordConfirm !== signupData.password) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const response = await axiosInstance.post(`${backendURL}/api_auth/register`, signupData);
      setSuccessMessage('Registration successful: ' + response.data.message);
      closeSignupModal();
    } catch (error) {
      handleAPIError(error);
    }
  };
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setLoginErrorMessage('');
    if (!email || !password) {
      setLoginErrorMessage('Email and password are required.');
      return;
    }
    const isEmail = email.includes('@');
    const loginData = {
      [isEmail ? 'email' : 'username']: email,
      password: password,
    };
    try {
      const response = await axiosInstance.post(`${backendURL}/api_auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
       const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.length > 0
        ? `Login failed: ${error.response.data.errors[0].msg}`
        : 'Login failed. Please try again later.';
      setLoginErrorMessage(errorMessage);
      console.error('Login failed:', error.response?.data || error);
    }
  };
  
  const handleLogout = async () => {
    if (!authToken) {
      console.error('No auth token found.');
      return;
    }
    try {
      const response = await axios.post(`${backendURL}/api_auth/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.status === 200) {
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out:', response.status, response.data);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token'); 
    setAuthToken(null); 
    setIsLoggedIn(false); 
  };


const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  if (!forgotPasswordData.email) {
    setForgotPasswordErrorMessage('Email is required.');
    return;
  }
  try {
    if (passwordResetEmail) {
      const response = await axios.post(`${backendURL}/api_auth/reset-password`, {
        email: forgotPasswordData.email,
        code: verificationCode,
      });
    } else {
      const response = await axios.post(`${backendURL}/api_auth/forgot-password`, {
        email: forgotPasswordData.email,
      });
      if (response.data.message) {
        setSuccessMessage(response.data.message);
      }
    }
  } catch (error) {
    handleAPIError(error);
  }
};


  return (
    <header className={`headerContainer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='left'>
        <button className="sidebarToggle" onClick={() => setIsSidebarOpen(prev => !prev)}>☰</button>
        <div>
          <div className="logoContainer">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>
        </div>
      </div>
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      <div>
        {isFacultyPage && (
          <div>
            <input type="text" className="inputBar" placeholder={`Search in `} onChange={onSearchChange} />
            <button className="authButton">Search</button>
          </div>
        )}
      </div>

      <div className="authButtons">
        {isLoggedIn ? (
          <div>
            <button className="authButton" onClick={handleLogout}>Logout</button>
            {isAdmin && (
              <Link to="/admin" className="admin-button">Admin Page</Link>
            )}
          </div>
        ) : (
          <div className='logoReg'>
            <button className="authButton" onClick={() => setIsLoginModalOpen(true)}>Login</button>
            <button className="authButton" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
          </div>
        )}
      </div>

      <Modal isOpen={isSignupOpen} onClose={closeSignupModal} isDarkMode={isDarkMode}>
        <label htmlFor="username"><h1>SignUp</h1></label>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSignupSubmit}>
          <Input type="text" id="username" name="username" value={signupData.username} onChange={handleSignupInputChange} placeholder="Username" />
          <Input type="email" id="email" name="email" value={signupData.email} onChange={handleSignupInputChange} placeholder="Email" />
          <Input type="password" id="password" name="password" value={signupData.password} onChange={handleSignupInputChange} placeholder="Password" />
          <Input type="password" id="confirm-password" name="confirm-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Confirm Password" />
          <button type="submit" className="authButton">Submit</button>
        </form>
      </Modal>

      <Modal isOpen={isForgotPasswordOpen} onClose={closeForgotPasswordModal} isDarkMode={isDarkMode}>
        <label htmlFor="username"><h1>Forget Password</h1></label>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleForgotPasswordSubmit}>
          {passwordResetEmail ? (
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code:</label>
              <input type="text" id="verificationCode" name="verificationCode"  className="inputBar" placeholder="Verification Code" value={verificationCode} onChange={handleVerificationCodeChange} required/>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" className="inputBar" placeholder="Email" value={forgotPasswordData.email} onChange={handleForgotPasswordInputChange} required/>
            </div>
          )}
          <button type="submit" className="authButton">
            {passwordResetEmail ? 'Reset Password' : 'Send Verification Code'}
          </button>
          {passwordResetEmail && (
            <button className="authButton" onClick={handleBackToLogin}> Back to Login </button>
          )}
        </form>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} isDarkMode={isDarkMode}>
        <h1>Login</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {loginErrorMessage && <div className="error-message">{loginErrorMessage}</div>}
        <form onSubmit={handleLoginSubmit}>
    <div className="form-group">
      <label htmlFor="usernameOrEmail">Username or Email:</label>
      <input
        type="text"
        id="usernameOrEmail"
        name="usernameOrEmail"
        className="inputBar"
        placeholder="Username or Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        className="inputBar"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Changed setPasswordConfirm to setPassword
        placeholder="Password"
        required
      />
    </div>
    <button type="submit" className="authButton">Login</button>
    <button type="button" className="authButton" onClick={handleForgotPassword}>Forgot Password</button>
  </form>
</Modal>

    </header>

  );
};
export default Header;
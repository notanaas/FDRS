import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FacultyButtons from './FacultyButtons';
import WelcomingPage from './WelcomingPage';
import axios from 'axios';
import './App.css';
function Sidebar({ onClose ,isDarkMode}) {
  const [localIsDarkMode, setLocalIsDarkMode] = useState(false);
  const modalContentStyle = {
    backgroundColor: localIsDarkMode ? 'black' : 'white', 
    color: localIsDarkMode ? 'white' : 'black', 
  };
  useEffect(() => {
    setLocalIsDarkMode(isDarkMode);
  }, [isDarkMode]);
  return (
    <div className="sidebar" style={modalContentStyle} >

      <button className="closeBtn" onClick={onClose}isDarkMode={isDarkMode}>Press To Close</button>
      <FacultyButtons />
    </div>
  );
}
const Modal = ({ isOpen, onClose, children, isDarkMode }) => {
  const [localIsDarkMode, setLocalIsDarkMode] = useState(false);
  useEffect(() => {
    setLocalIsDarkMode(isDarkMode);
  }, [isDarkMode]);

  const modalContentStyle = {
    backgroundColor: localIsDarkMode ? '#fff' : 'white', 
    color: localIsDarkMode ? 'white' : 'black', 
  };

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="upload-modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }}>
        </div>
        <div className="modal-body">
          {children}
          
        </div>
        <div className="modal-footer">
          
        </div>
      </div>
    </div>
  );
};
const Header = ({
  selectedFacultyName,
  onSearchChange,
  isFacultyPage,
  isAdmin,
  userToken,
  setUserToken,
}) => {
  const backendURL = 'http://localhost:3000';
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
  const [loginError, setLoginError] = useState(''); // New state for login error message
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState(false); // New state for password reset email
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  
  const handleFacultySelection = (FacultyName) => {
    setSelectedFaculty(FacultyName);
  };
  
  

  

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

  const handleForgotPassword = () => {
    // When "Forgot Password" is clicked, set the password reset email state and hide the password field
    setPasswordResetEmail(email);
    setPassword('');
    setIsLoginModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleBackToLogin = () => {
    // When the user clicks "Back to Login" from the password reset screen
    setPasswordResetEmail(false); // Clear the password reset email state
    setPassword(''); // Clear the password field
    setVerificationCode(''); // Clear the verification code field
    setIsForgotPasswordOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    // Implement the backend logic to verify the email and send a reset code
    axios
      .post(`${backendURL}/api_auth/forgot-password`, { email: passwordResetEmail, verificationCode })
      .then((response) => {
        setSuccessMessage('An email with a password reset link has been sent.');
        closeForgotPasswordModal();
      })
      .catch((error) => {
        setErrorMessage('Password reset failed: ' + error.response.data.errors[0].msg);
        console.error('Password reset failed:', error.response.data.errors);
      });
  };

  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({
      ...forgotPasswordData,
      [name]: value,
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();


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
  
  const checkLogin = (usernameOrEmail, password) => {
    const isEmail = usernameOrEmail.includes('@');
    
    const loginData = isEmail
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password };
  
    axios
      .post(`${backendURL}/api_auth/login`, loginData)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setUserToken(token); 
        setSuccessMessage('Login successful');
        console.log('Login successful:', response.data);
        setLoginError('');
      })
      .catch((error) => {
        setLoginError('Username or email and password are incorrect');
        console.error('Login failed:', error.response.data);
      });
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null); 
  }

  
  

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setVerificationCode(''); 
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setLoginError(''); // Clear the login error
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    checkLogin(email, password);
  };
  

  return (
    <header className={`headerContainer ${isDarkMode ? 'dark' : 'light'}`}>   
        <button className="sidebarToggle" onClick={() => setIsSidebarOpen(prev => !prev)}isDarkMode={isDarkMode}>☰</button>
   {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} isDarkMode={isDarkMode}/>}

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
              className="inputBar"
              placeholder={`Search in `}
              onChange={onSearchChange}
            />
            <button className="authButton">Search</button>
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
            <button className="authButton" onClick={openLoginModal}>
              Login
            </button>
            <button className="authButton" onClick={openSignupModal}>
              Sign Up
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isSignupOpen} onClose={closeSignupModal} isDarkMode={isDarkMode}>
      <label htmlFor="username"><h1>SignUp</h1></label>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSignupSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="inputBar"
              placeholder="Username"
              value={signupData.username}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="inputBar"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="inputBar"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              className="inputBar"
              placeholder="Confirm Password"
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
      <label htmlFor="username"><h1>Forget Password</h1></label>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleForgotPasswordSubmit}>
          {passwordResetEmail ? (
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code:</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                className="inputBar"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="inputBar"
                placeholder="Email"
                value={forgotPasswordData.email}
                onChange={handleForgotPasswordInputChange}
                required
              />
            </div>
          )}
          <button type="submit" className="authButton">
            {passwordResetEmail ? 'Reset Password' : 'Send Verification Code'}
          </button>
          {passwordResetEmail && (
            <button className="authButton" onClick={handleBackToLogin}>
              Back to Login
            </button>
          )}
        </form>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} isDarkMode={isDarkMode}>
      <label htmlFor="username"><h1>LogIn</h1></label>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {loginError && <div className="error-message">{loginError}</div>}

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
      onChange={handleEmailChange}
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
      placeholder="Password"
      value={password}
      onChange={handlePasswordChange}
      required
    />
  </div>
  <button type="submit" className="authButton">
    Login
  </button>
  <button className="authButton" onClick={handleForgotPassword}>
    Forgot Password
  </button>
  
</form>
      </Modal>
      
    </header>
    
  );
};
export default Header;
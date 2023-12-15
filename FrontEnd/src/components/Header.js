import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import FeedbackForm from './FeedbackForm';
import Modal from './Modal';
import axios from 'axios';
import './Header.css';
import { RouteParamsContext } from './context/RouteParamsContext';
import './Sidebar.css';

const Sidebar = ({ }) => {
  return (
    <div className="sidebar">
      <FacultyButtons />
    </div>
  );
}

const Input = ({ type, id, name, value, onChange, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{placeholder}</label>
    <input type={type} id={id} name={name} className="inputBarH" placeholder={placeholder} value={value} onChange={onChange} required />
  </div>
);


const Header = ({ setIsModalOpen,isLoading }) => {
  const backendURL = 'http://localhost:3002';
  const axiosInstance = axios.create({ baseURL: backendURL });
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { updateLoginStatus, isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, user, setUser, authToken, setAuthToken, refreshToken,logout } = useContext(AuthContext);
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
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');
  const [ForgotPasswordErrorMessage, setForgotPasswordErrorMessage] = useState('');
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const tokenFromLink = location.state?.token;
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;

  const goToUserProfile = () => {
    history.push('/my-profile');
  };
  useEffect(() => {
    if (location.pathname.includes('/faculty')) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(false);

    }

    
    if (tokenFromLink) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${backendURL}/api_faculty/${facultyId}`, {
            headers: {
              Authorization: `Bearer ${tokenFromLink}`
            }
          });
        } catch (error) {
        }
      };
      fetchData();
    }
    

  }, [tokenFromLink, facultyId, history, setIsLoggedIn, backendURL, isFacultyPage, location]);
  
  const clearFormFields = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setSignupData({ username: '', email: '', password: '' }); // Reset signup data
    setLoginErrorMessage('');
    setSignupErrorMessage('');
    setSuccessMessage('');
  };

  const handleSignupModalOpen = () => {
    setIsLoginModalOpen(false);
    setIsSignupOpen(true);
    clearFormFields();
  };

  const handleLoginModalOpen = () => {
    setIsSignupOpen(false);
    setIsLoginModalOpen(true);
    clearFormFields();
  };

  const closeSignupModal = () => {
    setIsSignupOpen(false);
    clearFormFields();
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    clearFormFields();
  };
  const handleForgotPassword = () => {
    setPasswordResetEmail(email);
    setPassword('');
    setIsLoginModalOpen(false);
    setIsSignupOpen(false); // Close signup modal if open
    setIsForgotPasswordOpen(true);
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (passwordConfirm !== signupData.password) {
      setLoginErrorMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axiosInstance.post(`${backendURL}/api_auth/register`, signupData);
      setSuccessMessage('Registration successful: ' + response.data.message);
      closeSignupModal();
    } catch (error) {
      setLoginErrorMessage('Login failed. Please try again.');
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setLoginErrorMessage('');

    if (!email || !password) {
      setLoginErrorMessage('Email and password are required.');
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${backendURL}/api_auth/login`, loginData);
      const { token, refreshToken, user } = response.data;

      if (token) {
        // Store the token, refresh token, and isAdmin status in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isAdmin', user.isAdmin.toString());

        // Update the AuthContext with the new user information
        setAuthToken(token);
        setIsLoggedIn(true);
        setIsAdmin(user.isAdmin);
        setUser(user); // This updates the user information in the context

        // Close the modal and clear form fields
        setIsLoginModalOpen(false);
        setEmail('');
        setPassword('');

        // If you have a function that updates the login status in the context, use it
        // Otherwise, you can directly set the states as shown above
        if (updateLoginStatus) {
          updateLoginStatus(true, user.isAdmin, user);
        }
      } else {
        setLoginErrorMessage('Login response did not include the token.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.errors?.length > 0
        ? `Login failed: ${error.response.data.errors[0].msg}`
        : 'Login failed. Please try again later.';
      setLoginErrorMessage(errorMessage);
    }
  };
  const handleLogout = async () => {
 logout();
  };
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordErrorMessage('');
    setSuccessMessage('');

    if (!forgotPasswordData.email) {
      setForgotPasswordErrorMessage('Email is required.');
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/api_auth/forgot-password`, {
        email: forgotPasswordData.email,
      });

      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setIsForgotPasswordOpen(false);
      }
    } catch (error) {
      handleAPIError(error);
      setForgotPasswordData({ email: '' });
    }
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
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
  };
  const handleBackToLogin = () => {
    setPasswordResetEmail(false);
    setPassword('');
    setIsForgotPasswordOpen(false);
    setIsLoginModalOpen(true);
  };
  

  const handleForgotPasswordInputChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, email: e.target.value });
  };


  

  const closeFileUpload = () => {
    setIsFileUploadOpen(false); 
  };
  const handleUploadButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    setIsModalOpen(true); 
  };


  return (
    <header className={`headerContainer ${isLoading ? 'loading' : ''}`}>
      <div className='left'>
        <button className="sidebarToggle" onClick={toggleSidebar}>☰</button>
        <div className="logoContainer">
          <Link to="/welcomingpage">
            <img src="/logo.png" alt="Logo" className="logo" />
          </Link>
        </div>
        {isSidebarOpen && <Sidebar />}
      </div>
      {showLoginPrompt && (
        <div className="login-prompt"><b>You need to be logged in to upload files.</b></div>
      )}

{isFacultyPage && (
  <div className="search-upload-container">
    <div className="search-container">  
      {<FeedbackForm user={user} authToken={authToken} />}
    </div>
    <div className="action-buttons">
      <button onClick={handleUploadButtonClick} className="authButton">
        Upload
      </button>
      {isFileUploadOpen && <FileUpload facultyId={facultyId} closeFileUpload={closeFileUpload} />}
    </div>
  </div>
)}
      <div className="authButtons">
        {isLoggedIn ? (
          <div className='button'>
        
            <button className="authButtonL" onClick={handleLogout}>🔚
            </button>
            <button onClick={goToUserProfile} className="profile-button">
              <img src={`${process.env.PUBLIC_URL}/img_avatar.png`} alt="Profile" />
            </button>
          </div>
        ) : (
          <div className='logoReg'>
            <button className="authButtonL" onClick={handleLoginModalOpen}><b>Login</b></button>
            <button className="authButtonL" onClick={handleSignupModalOpen}><b>Sign Up</b></button>
        </div>
        )}
      </div>
      {isFileUploadOpen && (
        <FileUpload facultyId={facultyId} />
      )}

<Modal isOpen={isSignupOpen} onClose={closeSignupModal} >
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
      <Modal isOpen={isForgotPasswordOpen} onClose={closeForgotPasswordModal} >
        <label htmlFor="username"><h1>Forget Password</h1></label>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleForgotPasswordSubmit}>
          {passwordResetEmail ? (
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code:</label>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" className="inputBarH" placeholder="Email" value={forgotPasswordData.email} onChange={handleForgotPasswordInputChange} required />
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
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} >
        <h1>Login</h1>
        {loginErrorMessage && <div className="error-message">{loginErrorMessage}</div>}
        <form onSubmit={handleLoginSubmit}>
     
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email:</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="inputBarH"
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
              className="inputBarH"
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
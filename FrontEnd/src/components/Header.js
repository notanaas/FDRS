import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import FeedbackForm from './FeedbackForm';
import Modal from './Modal';
import axios from 'axios';
import './Header.css';
import { RouteParamsContext } from './context/RouteParamsContext';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './Sidebar.css';

const Sidebar = () => {
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


const Header = ({ setIsModalOpen, isLoading, onSearch }) => {
  const backendURL = 'http://localhost:3002';
  const axiosInstance = axios.create({ baseURL: backendURL });
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { updateLoginStatus, isLoggedIn, setIsLoggedIn, setIsAdmin, setUser, authToken, setAuthToken, logout } = useContext(AuthContext);
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');
  const [forgotPasswordErrorMessage,setForgotPasswordErrorMessage] = useState('');
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const tokenFromLink = location.state?.token;
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;
  const facultyName = location.state?.facultyName || 'Faculty';
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loading, setLoading] = useState(true);//////////
  const PASSWORD_VISIBILITY_TIMEOUT = 5000;
  const [searchResults, setSearchResults] = useState([]);
  const [isResettingPassword, setIsResettingPassword] = useState(false);


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
          await axios.get(`${backendURL}/api_faculty/${facultyId}`, {
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

  const handleForgotPassword = () => {
    setPasswordResetEmail(email);
    setPassword('');
    setIsLoginModalOpen(false);
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(true);
  };
  const toggleLoginPasswordVisibility = (event) => {
    event.preventDefault();
    setShowLoginPassword(true);
    setTimeout(() => {
      setShowLoginPassword(false);
    }, PASSWORD_VISIBILITY_TIMEOUT);
  };

  const toggleSignupPasswordVisibility = (event) => {
    event.preventDefault();
    setShowSignupPassword(true);
    setTimeout(() => {
      setShowSignupPassword(false);
    }, PASSWORD_VISIBILITY_TIMEOUT);
  };

  const handleSignupSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!signupData.username.trim() || signupData.username.length < 3) {
      setSignupErrorMessage('Username must be at least 3 characters long.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupErrorMessage('Invalid email format.');
      return;
    }

    if (signupData.password.length < 6) {
      setSignupErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (passwordConfirm !== signupData.password) {
      setSignupErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post(`${backendURL}/api_auth/register`, signupData);
      setSuccessMessage('Registration successful: ' + response.data.message);
      closeSignupModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors.map(err => err.msg).join(", ");
        setSignupErrorMessage(backendErrors);
      } else {
        setSignupErrorMessage('Signup failed. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setLoginErrorMessage('');
    setLoading(true);

    if (!usernameOrEmail || !password) {
      setLoginErrorMessage('Username/Email and password are required.');
      return;
    }

    const loginData = {
      username: usernameOrEmail,
      email: usernameOrEmail,
      password: password,
    };

    try {
      const response = await axios.post(`${backendURL}/api_auth/login`, loginData);
      const { token, refreshToken, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isAdmin', user.isAdmin.toString());

        setAuthToken(token);
        setIsLoggedIn(true);
        setIsAdmin(user.isAdmin);
        setUser(user);
        setSuccessMessage('Login Successful');
        setIsLoginModalOpen(false);
        setEmail('');
        setPassword('');

        if (updateLoginStatus) {
          updateLoginStatus(true, user.isAdmin, user);
        }
      } else {
        setLoginErrorMessage('Login response did not include the token.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message
        ? error.response.data.message
        : 'Login failed. Please try again later.';
      setLoginErrorMessage(errorMessage);
    }
    finally {
      setLoading(false); // End loading
    }
  };

  const handleLogout = async () => {
    logout();
  };
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsResettingPassword(true);
    setForgotPasswordErrorMessage('');
    setSuccessMessage('');
    setLoading(true); // Start loading

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
    finally {
        setIsResettingPassword(false);;
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
  const handleSearchUpdate = (results) => {
    setSearchResults(results); // This updates the local state
    if (onSearch) {
      onSearch(results); // This lifts the state up to App.js
    }
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
            {<FeedbackForm authToken={authToken} onSearchResults={handleSearchUpdate} />}
          </div>
          <div className="action-buttons">
            <button onClick={handleUploadButtonClick} className="authButton">
              Upload
            </button>
            <h1>{facultyName}</h1>
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
            <button className="authButtonL" onClick={handleLoginModalOpen}>Login</button>
            <button className="authButtonL" onClick={handleSignupModalOpen}>Sign Up</button>
          </div>
        )}
      </div>
      {isFileUploadOpen && (
        <FileUpload facultyId={facultyId} />
      )}

      <Modal isOpen={isSignupOpen} onClose={closeSignupModal}>
        <label htmlFor="username"><h1>SignUp</h1></label>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {signupErrorMessage && (
          <div className="error-message">
            {signupErrorMessage}
          </div>
        )}

<form onSubmit={handleSignupSubmit}>
    <Input type="text" id="username" name="username" value={signupData.username} onChange={handleSignupInputChange} placeholder="Username" />
    <Input type="email" id="email" name="email" value={signupData.email} onChange={handleSignupInputChange} placeholder="Email" />

    <div className="password-input-container">
        <Input
            type={showSignupPassword ? "text" : "password"}
            id="password"
            name="password"
            value={signupData.password}
            onChange={handleSignupInputChange}
            placeholder="Password"
        />
        <div
            className="icon"
            onClick={() => setShowSignupPassword(!showSignupPassword)}
        >
            {showSignupPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </div>
    </div>

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
          <button type="submit" className="authButton" disabled={isResettingPassword}>
          {isResettingPassword ? 'Sending...' : 'Reset Password'}
          </button>

          {isResettingPassword && <div className="loading-message">Please wait...</div>}

        </form>
      </Modal>
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} >
        <h1>Login</h1>
        {loginErrorMessage && <div className="error-message">{loginErrorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email:</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="inputBarH"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="input-icon-container">
              <input
                type={showLoginPassword ? "text" : "password"}
                id="password"
                name="password"
                className="inputBarH"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <div
                className="icon"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </div>
            </div>
          </div>

          {/* <button onClick={(e) => toggleLoginPasswordVisibility(e)} className="password-toggle">
  {showLoginPassword ? 'Hide' : 'Show'} */}
          {/* </button> */}
          <button type="submit" className="authButton" onClick={handleLoginSubmit}>Login</button>
          <button type="button" className="authButton" onClick={handleForgotPassword}>Forgot Password</button>
        </form>
      </Modal>



    </header>

  );
};

export default Header;
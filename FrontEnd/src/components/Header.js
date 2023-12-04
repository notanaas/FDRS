import React, { useState, useEffect, useContext,useCallback } from 'react';
import {  Link, useHistory,useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import FeedbackForm from './FeedbackForm';
import Modal from './Modal';
import axios from 'axios';
import './App.css';
import { RouteParamsContext } from './context/RouteParamsContext'; 
import { debounce } from 'lodash';
import './Sidebar.css'; 

const Sidebar = ({ }) => {
  return (
    <div className="sidebar">
    <FacultyButtons/>
    </div>
  );
}

const Input = ({ type, id, name, value, onChange, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{placeholder}</label>
    <input type={type} id={id} name={name} className="inputBar" placeholder={placeholder} value={value} onChange={onChange} required />
  </div>
);


const Header = ({ setIsModalOpen }) => {
  const backendURL = 'http://localhost:3002';
  const axiosInstance = axios.create({ baseURL: backendURL });
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false); 
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { updateLoginStatus,isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, user, setUser, authToken, setAuthToken } = useContext(AuthContext);
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
  const [loginError,setLoginError] = useState(''); 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [ForgotPasswordErrorMessage,setForgotPasswordErrorMessage] = useState(''); 
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const tokenFromLink = location.state?.token;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;
  const userId = user?._id; 
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const goToUserProfile = () => {
    history.push('/my-profile');
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api_resource/search`, {
        params: { term: query },
      });
      setSearchResults(response.data); // Assuming the response data is the array of search results
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]); // Reset results on error
    } finally {
      setIsLoading(false);
    }
  };
  const debouncedSearch = useCallback(debounce(fetchSearchResults, 300), []);
  const handleSearchSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api_resource/search`, {
        params: { term: searchTerm },
      });
      setSearchResults(response.data);
      console.log('Search Results:', response.data); 
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error('Error during search:', error);
      setNoResults(true); 
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]); 
    }
  }, [searchTerm, debouncedSearch]);


useEffect(() => {
  if (location.pathname.includes('/faculty')) {
    setIsSidebarOpen(false);
  } else {
    setIsSidebarOpen(true);

  }
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
    return () => {
    darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
  };
  
}, [tokenFromLink, facultyId, history, setIsLoggedIn, backendURL,isFacultyPage,location]);
  
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
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(`${backendURL}/api_auth/logout`, { refreshToken }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setIsAdmin(false);
  
      history.push('/welcomingpage'); 
    } catch (error) {
      console.error('Logout error:', error);
    }
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
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setLoginError('');
  };

  const handleForgotPasswordInputChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, email: e.target.value });
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
  
  const closeFileUpload = () => {
    setIsFileUploadOpen(false); // Close FileUpload
  };

  const handleUploadButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    setIsModalOpen(true); // This should match the prop name passed to Header
  };
  
  const handleGiveFeedback = () => {
    if (!feedbackSubmitted && searchTerm) {
      setShowFeedbackForm(true);
      setFeedbackSubmitted(true); // Prevent multiple submissions
    }
  };
  
  
  return (
    <header className={`headerContainer ${isDarkMode ? 'dark' : 'light'}`}>
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
      <div className="login-prompt">You need to be logged in to upload files.</div>
    )}

    {isFacultyPage && (
      <div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search resources..."
            className="inputBar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {isLoading && <div>Loading...</div>}
        </div>
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id}>{result.title}</div>
            ))
          ) : isLoading ? (
            <div>Loading...</div>
          ) : noResults ? (
            <div>
              <p>No results found for "{searchTerm}".</p>
              <button className="authButton"onClick={handleGiveFeedback}>Give Feedback</button>

              {showFeedbackForm && (<FeedbackForm searchTerm={searchTerm} />)}
                          </div>
          ) : null}
          <div className="action-buttons">
            <button onClick={handleSearchSubmit} className="authButton" disabled={isLoading}>
              Search
            </button>
            <button onClick={handleUploadButtonClick} className="authButton">
              Upload
            </button>
            {isFileUploadOpen && <FileUpload facultyId={facultyId} closeFileUpload={closeFileUpload} />}
          </div>
        </div>
      </div>
    )}
  <div className="authButtons">
    {isLoggedIn ? (
      <div className='button'>
        <button className="authButton" onClick={handleLogout}>Logout
        </button>
        <button onClick={goToUserProfile} className="profile-button">
        <img src={`${process.env.PUBLIC_URL}/picon.png`} alt="Profile" /> 
        </button>
      </div>
    ) : (
      <div className='logoReg'>
        <button className="authButton" onClick={() => setIsLoginModalOpen(true)}>Login</button>
        <button className="authButton" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
      </div>
    )}
  </div>
  {isFileUploadOpen && (
        <FileUpload facultyId={facultyId} />
      )}

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
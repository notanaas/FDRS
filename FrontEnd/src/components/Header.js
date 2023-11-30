import React, { useState, useEffect, useContext,useCallback } from 'react';
import {  Link, useHistory,useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import axios from 'axios';
import './App.css';
import { RouteParamsContext } from './context/RouteParamsContext'; 
import { debounce } from 'lodash';
import './Sidebar.css'; // Ensure you have a CSS file for styles

const Sidebar = ({ }) => {
  return (
    <div className="sidebar">
    <FacultyButtons/>
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
  const modalContentStyle = { backgroundColor: isDarkMode ? '#333' : 'white',color: isDarkMode ? 'white' : 'black',};

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="upload-modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }}></div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer"></div>
      </div>
      <div 
      className="upload-modal" 
      style={{ display: isOpen ? 'flex' : 'none' }} 
      onClick={onClose}
    >
      <div 
        className="upload-modal-content" 
        style={modalContentStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }} />
        <div className="modal-body">{children}</div>
        <div className="modal-footer" />
      </div>
    </div>
    </div>
    
  );
};
const Header = ({}) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {isLoggedIn, updateLoginStatus, setIsLoggedIn, isAdmin, setIsAdmin } = useContext(AuthContext);
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
  const [setForgotPasswordErrorMessage] = useState(''); 
  const history = useHistory();
  const { setAuthToken} = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [alertMessage] = useState({ message: '', type: 'success' });
  const location = useLocation();
  const userToken = localStorage.getItem('token');
  const isFacultyPage = location.pathname.includes(`/faculty/`);
  const tokenFromLink = location.state?.token;
  const { routeParams } = useContext(RouteParamsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const facultyId = routeParams ? routeParams.facultyId : null;
  const uploadURL = facultyId ? `${backendURL}/api_resource/create/${facultyId}` : null;
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { user } = useContext(AuthContext);
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

  // Debounced function
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
  
  const handleFeedbackSubmit = async () => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }
  
    try {
      const response = await axiosInstance.post(`${backendURL}/FeedBack-post`, {
        User: user._id, 
        SearchText: searchTerm,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
  
      if (response.data) {
        console.log('Feedback submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting feedback', error);
    }
  };
  
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]); 
    }
  }, [searchTerm, debouncedSearch]);

const promptLogin = () => {
  setShowLoginPrompt(true);
  setTimeout(() => setShowLoginPrompt(false), 4000); 
};
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
  
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
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
    setPasswordResetEmail(false); 
    setPassword(''); 
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
  
    const loginData = {
      email: email,
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
        setIsLoginModalOpen(false); 
  
        setEmail('');
        setPassword('');
        updateLoginStatus(true); 
  
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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorFirstNameChange = (e) => {
    setAuthorFirstName(e.target.value);
  };

  const handleAuthorLastNameChange = (e) => {
    setAuthorLastName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const fileUrl = URL.createObjectURL(selectedFile);
        setImgUrl(fileUrl);
    }
};

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };
  const handleUploadClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    setIsModalOpen(true);
  };
  const handleUpload = async () => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }
    if (!title || !authorFirstName || !authorLastName || !description || !file || !img) {
      setError('Please fill in all required fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('firstname', authorFirstName);
    formData.append('lastname', authorLastName);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('img', img);

    // Append facultyId to the formData
    
  
    if (isAdmin) {
      formData.append('isApproved', true);
    }
  
    try {
      const response = await axios.post(uploadURL, formData, {
        headers: {
          'Authorization': `Bearer ${userToken}` 
        },
      });
  
      if (response.status === 201) {
        setSuccessMessage('Document uploaded successfully');
        if (isAdmin) {
          setSuccessMessage('Document uploaded and automatically approved');
        }
        setTitle('');
        setAuthorFirstName('');
        setAuthorLastName('');
        setDescription('');
        setFile(null);
        setImg(null);
        setImgUrl('');
        setError(null);
        setIsModalOpen(false); // Close modal after successful upload
      }
      else {
        console.log(response.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while uploading the document. Please try again later.';
      setError(message);
    }
  };
  
  
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
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
    {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
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
          <button onClick={handleFeedbackSubmit} className="authButton">
            Send Feedback
          </button>
        </div>    
      ) : null } 
      <div className="action-buttons">
        <button onClick={handleSearchSubmit} className="authButton" disabled={isLoading}>
          Search
        </button>
        <button onClick={handleUploadClick} className="authButton">
          Upload
        </button>
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


{isModalOpen && (
  <Modal isOpen={isModalOpen} onClose={closeModal} isDarkMode={isDarkMode}>
      <div className="custom-upload-modal">
    {error && (
      <div className="error-message">
        <p className="error-text">{error}</p>
      </div>
    )}
    {successMessage && (
      <div className="success-message">
        <p className="success-text">{successMessage}</p>
      </div>
    )}

    <div className="form-container">
    <label htmlFor="username"><h1>Upload File</h1></label>

<div className="form-group">
<label>Title:</label>
<input
type="text"
name="title"
value={title}
onChange={handleTitleChange}
className="inputBar"
/>
</div>
<div className="form-group">
<label>Author First Name:</label>
<input
type="text"
name="authorFirstName"
value={authorFirstName}
onChange={handleAuthorFirstNameChange}
className="inputBar"
/>
</div>
<div className="form-group">
<label>Author Last Name:</label>
<input
type="text"
name="authorLastName"
value={authorLastName}
onChange={handleAuthorLastNameChange}
className="inputBar"
/>
</div>
<div className="form-group">
<label>Description:</label>
<textarea
name="description"
value={description}
onChange={handleDescriptionChange}
className="inputBar"
></textarea>
</div>
<div className="form-group">
<label>Choose Document (PDF):</label>
<input
type="file"
accept="application/pdf"
onChange={handleFileChange}
className="inputBar"
/>
</div>
<div className="form-group">
<label>Choose Photo for Document (JPEG, JPG, PNG):</label>
<input
type="file"
accept="image/jpeg, image/jpg, image/png"
onChange={handleImgChange}
className="inputBar"
/>
</div>
</div>

{imgUrl && (
<div className="card">
<img className="uploaded-photo" src={imgUrl} alt="Document" />
<div className="card-body">
  <p className="card-title">{title}</p>
  <p className="card-text">Author First Name: {authorFirstName}</p>
  <p className="card-text">Author Last Name: {authorLastName}</p>
</div>
</div>
)}

  <div className="modal-footer">
          <button onClick={closeModal} className="authButton">
            Close
          </button>
          <button onClick={handleUpload} className="authButton">
            Upload
          </button>
        </div>
        {alertMessage.message && (
          <div className={`alert-message ${alertMessage.type}`}>
            {alertMessage.message}
          </div>
        )}
      </div>
  </Modal>
)}
    </header>

  );
};

export default Header;
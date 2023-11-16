import React, { useState, useEffect, useContext } from 'react';
import { useHistory,Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';
import axios from 'axios';
import './App.css';
const Sidebar = ({ onClose }) => {
  const { isLoggedIn } = useContext(AuthContext); 
  const history = useHistory();
  const goToUserProfile = () => {
    history.push('/my-profile');
  };
  useEffect(() => {
    console.log("Login status in Sidebar:", isLoggedIn);
  }, [isLoggedIn]);
  return (
    <div className="sidebar" >
      {isLoggedIn && (
  <button onClick={goToUserProfile} className="facultyauthButton">My Profile</button>
)}
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
  const modalContentStyle = { backgroundColor: isDarkMode ? '#333' : 'white',color: isDarkMode ? 'white' : 'black',};

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
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isLoggedIn, updateLoginStatus, setIsLoggedIn, isAdmin, setIsAdmin } = useContext(AuthContext);
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState(''); 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [message, setMessage] = useState('You are not logged in.');
  const [showMessage, setShowMessage] = useState(true);
  const [forgotPasswordError, setForgotPasswordErrorMessage] = useState(''); 
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
  
    if (token) {
      // Validate the token with an API call or some logic
      setIsLoggedIn(true);
      setIsAdmin(storedIsAdmin);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [setIsLoggedIn, setIsAdmin]);
  
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
  const goToAdminPage = () => {
    history.push('/admin');
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
    setSuccessMessage(''); // Assuming you have this state to show success messages
    setLoginErrorMessage(''); // Assuming you have this state to show error messages
  
    // Check if email and password inputs are not empty
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
  
        setAuthToken(token); // Assuming you have this state/context method
        setIsLoggedIn(true); // Assuming you have this state/context method
        setIsAdmin(user.isAdmin); // Assuming you have this state/context method
        setIsLoginModalOpen(false); // Assuming you have this state/context method to control the login modal display
  
        // Clear the input fields
        setEmail('');
        setPassword('');
        updateLoginStatus(true); 

      } else {
        // If no token is present in the response, show an error message
        setLoginErrorMessage('Error: Login response is missing the token or refreshToken.');
      }
    } catch (error) {
      // If there is an error in the login process, show an error message
      const errorMessage = error.response?.data?.errors?.length > 0
        ? `Login failed: ${error.response.data.errors[0].msg}`
        : 'Login failed. Please try again later.';
      setLoginErrorMessage(errorMessage);
    }
  };
  
  
  
  
  const handleLogout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!authToken || !storedRefreshToken) {
      console.error('No auth token or refresh token found. Redirecting to login...');
      setIsLoggedIn(false);
      return;
    }
  
    try {
      const response = await axios.post(`${backendURL}/api_auth/logout`, {
        refreshToken: storedRefreshToken,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (response.status === 200) {
        console.log('Logout successful');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setAuthToken(null);
        setIsLoggedIn(false);
      } else {
        console.error('Logout failed:', response.status, response.data);
      }
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

  return (
    <header className={`headerContainer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='left'>
        <button className="sidebarToggle" onClick={toggleSidebar}>☰</button>
        <div>
          <div className="logoContainer">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>
        </div>
      </div>
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
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
    <div className='button'>
      <button className="authButton" onClick={handleLogout}>Logout</button>
      {isLoggedIn && isAdmin && (
      <button onClick={goToAdminPage}className="authButton">Admin Page</button>
    )}
    </div>
      ) : (
        <div className='logoReg'>
          <button className="authButton" onClick={() => setIsLoginModalOpen(true)}>Login</button>
          <button className="authButton" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
        </div>
      )}
    </div>
    {showMessage && (
        <div className="login-status-message">{message}</div>
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
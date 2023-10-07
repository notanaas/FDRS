import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Modal from './Modal';
import { useTheme } from './ThemeContext';
import axios from 'axios';

const Header = ({ selectedFacultyName, onSearchChange, isFacultyPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { facultyName } = useFaculty();
  const { isDarkMode } = useTheme();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const openSignupModal = () => {
    setIsSignupOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Search:', selectedFacultyName);
    setEmail('');
    setPassword('');
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const backendURL = 'http://localhost:3007';

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${backendURL}/api/register`, signupData) // Use the backend URL here
      .then((response) => {
        console.log('Registration successful:', response.data.message);
        // Close the signup modal or perform any other actions needed
        closeSignupModal();
      })
      .catch((error) => {
        console.error('Registration failed:', error.response.data.errors);
        // Handle registration errors here
      });
  };

  return (
    <header className="headerContainer">
      <div className="logoContainer">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
        {facultyName && <h2 style={{ margin: '0', padding: '0' }}>{facultyName}</h2>}
      </div>

      <div>
        {isFacultyPage && (
          <div>
            <input
              type="text"
              className="searchBar"
              placeholder={`Search in ${selectedFacultyName}`}
              onChange={onSearchChange}
            />
            <button className="searchButton">Search</button>
          </div>
        )}
      </div>
      <div className="authButtons">
        <form onSubmit={handleSubmit}>
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

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={closeSignupModal} isDarkMode={isDarkMode}>
        <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
        </form>
      </Modal>
    </header>
  );
};

export default Header;

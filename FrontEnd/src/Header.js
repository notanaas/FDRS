import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Modal from './Modal';
import { useTheme } from './ThemeContext'; // Import the useTheme hook

const Header = ({ selectedFacultyName, onSearchChange, isFacultyPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false); // State to manage signup popup
  const { facultyName } = useFaculty();
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const openSignupModal = () => {
    setIsSignupOpen(true);
  };

  // Function to close the signup modal
  const closeSignupModal = () => {
    setIsSignupOpen(false);
  };
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  // Function to handle signup form submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Perform your signup logic here with the data in signupData

    // Close the signup modal
    closeSignupModal();
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle form submission here, e.g., send data to the server
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Search:', selectedFacultyName); // You can replace this with your search value

    // Reset the form fields
    setEmail('');
    setPassword('');
  };

  const openSignup = () => {
    setIsSignupOpen(true);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  // Use the useTheme hook to get the isDarkMode value
  const { isDarkMode } = useTheme();

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
          {/* Signup button */}
          <button className="authButton" onClick={openSignupModal}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={closeSignupModal} isDarkMode={isDarkMode}>
        <h2>ign Up</h2>
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

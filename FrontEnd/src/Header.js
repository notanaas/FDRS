import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';

const Header = ({ selectedFacultyName, onSearchChange, isFacultyPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { facultyName } = useFaculty();

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

  return (
    <header className="headerContainer">
      <div className="logoContainer">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
        {facultyName && <h2 style={{ margin: '0', padding: '0' }}>{facultyName}</h2>}
      </div>

      <div>
        {isFacultyPage && ( // Only render the search bar and button if isFacultyPage is true
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
        <button className="authButton">Sign Up</button>
      </div>
    </header>
    
  );
};

export default Header;

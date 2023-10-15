import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isDarkMode, toggleDarkMode, isAdmin }) => {
  return (
    <footer className={`footerContainer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="footerText">
        &copy; 2023 Your University
      </div>
      {isAdmin && (
        <div className="adminButtonContainer">
          <Link to="/admin" className="adminButton">
            Admin
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;

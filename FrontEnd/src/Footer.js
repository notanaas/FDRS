import React from 'react';
const Footer = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <footer className="footerContainer"> 
      <div className="footerText">
        &copy; 2023 Your University
      </div>
    </footer>
  );
};

export default Footer;

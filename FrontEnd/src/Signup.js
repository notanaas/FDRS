import React from 'react';
import { useTheme } from './ThemeContext'; 

const Signup = () => {
  const { isDarkMode } = useTheme(); 

  return (
    <div className={`popup ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="popup-content">
        <h2>Sign Up</h2>
        <form>
          {/* Add your form fields here */}
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
        <button className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Signup;

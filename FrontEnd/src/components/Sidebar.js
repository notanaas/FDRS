import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import FacultyButtons from './FacultyButtons';

import './Sidebar.css';
import { ActiveSectionContext } from './context/ActiveSectionContext';

const Sidebar = () => {
  const { activeSection, setActiveSection } = useContext(ActiveSectionContext);
  const { authToken, isAdmin } = useContext(AuthContext);
  const location = useLocation(); // This hook gets the current location object
  const isProfilePage = location.pathname.includes(`/my-profile`);

  return (
    <div className={`sidebar ${isProfilePage ? 'sidebar-open' : ''}`}>

      {isProfilePage &&(
       <div>
        <h1>Your Profile</h1>
        <button onClick={() => setActiveSection('profileInfo')} className={activeSection === 'profileInfo' ? 'active' : ''}>
          User Profile Information
        </button>
        <button onClick={() => setActiveSection('resources')} className={activeSection === 'resources' ? 'active' : ''}>
          Your Resources
        </button>
        <button onClick={() => setActiveSection('favorites')} className={activeSection === 'favorites' ? 'active' : ''}>
          Your Favorites
        </button>
        {isAdmin && (
          <button onClick={() => setActiveSection('adminActions')} className={activeSection === 'adminActions' ? 'active' : ''}>
            Admin Actions
          </button>
        )}
      </div>
      )}
      <h1>Faculties</h1>
      <FacultyButtons />
      <h1>About Us</h1>

      <div className="social-buttons">
            <a href="https://www.youtube.com/channel/UCvvQh8RPnGf8Z-AZrahYEbA" target="_blank" rel="noopener noreferrer"><img src="/youtube-icon.png" alt="YouTube" /> YouTube Channel</a>
            <a href="https://www.linkedin.com/in/anas-alseid-cs" target="_blank" rel="noopener noreferrer"><img src="/linkedin-icon.png" alt="LinkedIn Anas Alseid" /> Anas Alseid</a>
            <a href="https://www.linkedin.com/in/saif-karborani-a25a98222" target="_blank" rel="noopener noreferrer"><img src="/linkedin-icon.png" alt="LinkedIn Saif Karborani" /> Saif Karborani</a>
            <a href="https://www.linkedin.com/in/wasef-jayousi-5022aa250/" target="_blank" rel="noopener noreferrer"><img src="/linkedin-icon.png" alt="LinkedIn Wasef Joyousi" /> Wasef Joyousi</a>
            <a href="https://github.com/notanaas/FDRS.git" target="_blank" rel="noopener noreferrer"><img src="/github-icon.png" alt="GitHub" /> GitHub Repository</a>
            
          </div>
    </div>
  );
};
export default Sidebar;
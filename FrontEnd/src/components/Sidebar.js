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
    </div>
  );
};
export default Sidebar;
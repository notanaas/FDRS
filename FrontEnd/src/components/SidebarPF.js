import React from 'react';

function SidebarPF({ onSectionChange }) {
  return (
    <div className="sidebar">
      <button onClick={() => onSectionChange('profile')}>User Profile Information</button>
      <button onClick={() => onSectionChange('resources')}>Your Resources</button>
      <button onClick={() => onSectionChange('favorites')}>Your Favorites</button>
      <button onClick={() => onSectionChange('admin')}>Admin Actions</button>
    </div>
  );
}

export default SidebarPF;

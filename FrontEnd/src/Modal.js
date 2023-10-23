import React, { useState, useEffect } from 'react';
import './App.css'; // Import the modern modal styles

const Modal = ({ isOpen, onClose, children, isDarkMode }) => {
  const [localIsDarkMode, setLocalIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setLocalIsDarkMode(!localIsDarkMode);
  };

  useEffect(() => {
    setLocalIsDarkMode(isDarkMode);
  }, [isDarkMode]);

  const modalContentStyle = {
    backgroundColor: localIsDarkMode ? '#333' : 'white', // Background color
    color: localIsDarkMode ? 'white' : 'black', // Text color
  };

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="upload-modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }}>
        </div>
        <div className="modal-body">
          {children}
          
        </div>
        <div className="modal-footer">
          
        </div>
      </div>
    </div>
  );
};

export default Modal;

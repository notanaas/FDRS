import React, { useState, useEffect } from 'react';
import './App.css';

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
    <div className="modalContainer" style={{ display: isOpen ? 'block' : 'none' }} onClick={onClose}>
      <div className="modalContent" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Upload Document or Link</h2>
          <button className="closeButton" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

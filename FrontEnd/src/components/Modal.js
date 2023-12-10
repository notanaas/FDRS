import React from 'react';
import './Header.css';

const Modal = ({ isOpen, onClose, children, isDarkMode }) => {
  const modalContentStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="upload-modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

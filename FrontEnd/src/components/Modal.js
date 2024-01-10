import React from 'react';
import './Header.css';

const Modal = ({ isOpen, onClose, children }) => {
  // This function will be used to stop propagation for the modal content click
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`upload-modal ${isOpen ? 'modal-open' : ''}`}
      style={{ display: isOpen ? 'flex' : 'none' }}
      // onClick handler removed from here to stop closing the modal on backdrop click
    >
      <div className="upload-modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

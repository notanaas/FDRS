import React from 'react';
import './Header.css';

const Modal = ({ isOpen, onClose, children, shouldCloseOnBackdropClick }) => {
  
  const onBackdropClick = shouldCloseOnBackdropClick ? onClose : (e) => e.stopPropagation();

  return (
    <div className="upload-modal" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onBackdropClick}>
      <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// Set default props in case they are not passed
Modal.defaultProps = {
  shouldCloseOnBackdropClick: true, // By default, modals close on backdrop click
};

export default Modal;

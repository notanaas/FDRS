import React from 'react';
import './DeleteConfirmationModal.css'
const DeleteConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete the resource?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

export default DeleteConfirmationModal;

import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Adjust the z-index to ensure the modal is above other content */
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

// Define a styled button component
const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000;
  }
`;


// Inside your modal component:
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    
    <ModalOverlay>
      <ModalContent>
        {children}
        <StyledButton onClick={onClose}>Close</StyledButton>
        {/* Use StyledButton for your "Upload" button */}
        <StyledButton>Upload</StyledButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;

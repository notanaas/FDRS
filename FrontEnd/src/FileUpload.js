import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px; /* Add margin to match your design */
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

const FileInput = styled.input`
  display: none; /* Hide the default file input */
`;

const ChooseFileLabel = styled.label`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px; /* Add margin to match your design */
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Implement the upload logic here
    if (selectedFile) {
      // You can use the selectedFile for the upload
      alert('File uploaded successfully.');
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <ChooseFileLabel>
        Choose File
        <FileInput type="file" onChange={handleFileChange} />
      </ChooseFileLabel>
      <StyledButton onClick={handleUpload}>Upload</StyledButton>
    </div>
  );
}

export default FileUpload;

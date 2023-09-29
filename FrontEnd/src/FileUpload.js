import React, { useState } from 'react';


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
      <chooseFileLabel>
        Choose File
        <fileInput type="file" onChange={handleFileChange} />
      </chooseFileLabel>
      <styledButton onClick={handleUpload}>Upload</styledButton>
    </div>
  );
}

export default FileUpload;

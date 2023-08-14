import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ faculty }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Adjust the URL to your backend file upload API endpoint
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default FileUpload;

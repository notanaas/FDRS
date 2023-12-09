import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import Modal from './Modal';
import { RouteParamsContext } from './context/RouteParamsContext'; 

const FileUpload = ({ isModalOpen, setIsModalOpen }) => {
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { authToken, isAdmin } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;
  const backendURL = 'http://localhost:3002';
  const uploadURL = facultyId ? `${backendURL}/api_resource/create/${facultyId}` : null;

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorFirstNameChange = (e) => setAuthorFirstName(e.target.value);
  const handleAuthorLastNameChange = (e) => setAuthorLastName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

 

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const fileUrl = URL.createObjectURL(selectedFile);
        setImgUrl(fileUrl);
    }
};
const handleImgChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    setImg(e.target.files[0]);
  }
};
  const handleUpload = async () => {
    if (!title || !authorFirstName || !authorLastName || !description || !file || !img) {
      setError('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('firstname', authorFirstName);
    formData.append('lastname', authorLastName);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('img', img);

    if (isAdmin) {
      formData.append('isApproved', true);
    }

    try {
      const response = await axios.post(uploadURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 201) {
        setSuccessMessage('Document uploaded successfully');
        setError('');
        setTitle('');
        setAuthorFirstName('');
        setAuthorLastName('');
        setDescription('');
        setFile(null);
        setImg(null);
        setImgUrl(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while uploading the document.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };
// Example toggle function in your main component
const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode); // This will toggle the dark mode state
};


  return (
    <>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} isDarkMode={isDarkMode}>
          <div className="custom-upload-modal">
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="form-container">
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" value={title} onChange={handleTitleChange} className="inputBar" />

              <label htmlFor="authorFirstName">Author First Name:</label>
              <input type="text" id="authorFirstName" value={authorFirstName} onChange={handleAuthorFirstNameChange} className="inputBar" />

              <label htmlFor="authorLastName">Author Last Name:</label>
              <input type="text" id="authorLastName" value={authorLastName} onChange={handleAuthorLastNameChange} className="inputBar" />

              <label htmlFor="description">Description:</label>
              <textarea id="description" value={description} onChange={handleDescriptionChange} className="inputBar"></textarea>

              <label htmlFor="documentFile">Choose Document (PDF):</label>
              <input type="file" id="documentFile" accept="application/pdf" onChange={handleFileChange} className="inputBar" />

              <label htmlFor="imageFile">Choose Photo for Document (JPEG, JPG, PNG):</label>
              <input type="file" id="imageFile" accept="image/jpeg, image/jpg, image/png" onChange={handleImgChange} className="inputBar" />
            </div>

            {imgUrl && (
              <div className="card">
                <img className="uploaded-photo" src={imgUrl} alt="Document" />
                <div className="card-body">
                  <p className="card-title">{title}</p>
                  <p className="card-text">Author First Name: {authorFirstName}</p>
                  <p className="card-text">Author Last Name: {authorLastName}</p>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button onClick={closeModal} className="authButton">Close</button>
              <button onClick={handleUpload} className="authButton">Upload</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FileUpload;
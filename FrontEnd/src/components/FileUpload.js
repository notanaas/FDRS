import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import Modal from './Modal';
import { RouteParamsContext } from './context/RouteParamsContext'; 
const Input = ({ type, id, name, value, onChange, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{placeholder}</label>
    <input type={type} id={id} name={name} className="inputBarH" placeholder={placeholder} value={value} onChange={onChange} required />
  </div>
);

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
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

              <Input placeholder="Title"type="text" id="title" value={title} onChange={handleTitleChange} className="inputBarH" />

              <Input placeholder="Author FirstName"type="text" id="authorFirstName" value={authorFirstName} onChange={handleAuthorFirstNameChange} className="inputBarH" />

              <Input placeholder="Author LastName"type="text" id="authorLastName" value={authorLastName} onChange={handleAuthorLastNameChange} className="inputBarH" />

              <Input placeholder="Description"type="text" id="description" value={description} onChange={handleDescriptionChange} className="inputBarH" />

              <Input placeholder="File To upload(PDF)"type="file" id="documentFile" accept="application/pdf" onChange={handleFileChange} className="inputBarH" />

              <Input placeholder="Related Image"type="file" id="imageFile" accept="image/jpeg, image/jpg, image/png" onChange={handleImgChange} className="inputBarH" />

           

            <div className="modal-footer">
              <button onClick={closeModal} className="authButton">Close</button>
              <button onClick={handleUpload} className="authButton">Upload</button>
            </div>
        </Modal>
      )}
    </>
  );
};

export default FileUpload;
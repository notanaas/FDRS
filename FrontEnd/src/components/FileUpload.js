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
  const [validationErrors, setValidationErrors] = useState({});
  const backendURL = 'http://localhost:3002';
  const uploadURL = facultyId ? `${backendURL}/api_resource/create/${facultyId}` : null;
  const validateField = (fieldName, value) => {
    let errors = { ...validationErrors };
    const alphaRegex = /^[a-zA-Z ]+$/; // Only letters and spaces
    const invalidPatternRegex = /^[-_ ]+$/; // Matches strings of only dashes, underscores, or spaces
  
    switch (fieldName) {
      case 'title':
      case 'authorFirstName':
      case 'authorLastName':
        if (!value.trim() || !alphaRegex.test(value) || invalidPatternRegex.test(value)) {
          errors[fieldName] = "Invalid input. Ensure it's not empty, only contains letters and spaces, and is not a repetitive pattern.";
        } else {
          delete errors[fieldName];
        }
        break;
      case 'description':
        if (!value.trim() || value.length < 10 || value.length > 200 || invalidPatternRegex.test(value)) {
          errors['description'] = "Invalid description. Ensure it's 10-200 characters long, not empty, and not a repetitive pattern.";
        } else {
          delete errors['description'];
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };
  
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorFirstNameChange = (e) => setAuthorFirstName(e.target.value);
  const handleAuthorLastNameChange = (e) => setAuthorLastName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const validateAllFields = () => {
    validateField('title', title);
    validateField('authorFirstName', authorFirstName);
    validateField('authorLastName', authorLastName);
    validateField('description', description);
    validateFileInput();
  };
  const validateFileInput = () => {
    let errors = { ...validationErrors };
    if (!file) {
      errors.file = "Document file is required";
    } else {
      delete errors.file;
    }
    if (!img) {
      errors.img = "Image file is required";
    } else {
      delete errors.img;
    }
    setValidationErrors(errors);
  };

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
    
    validateAllFields();
  if (Object.keys(validationErrors).length > 0 || !title || !authorFirstName || !authorLastName || !description || !file || !img) {
    setError('Please correct the errors before submitting.');
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



  return (
    <>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} >
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
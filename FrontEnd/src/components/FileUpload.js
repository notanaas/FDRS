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
  // State declarations
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { authToken, isAdmin } = useContext(AuthContext);
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;
  const [validationErrors, setValidationErrors] = useState({});
  const backendURL = 'http://localhost:3002';
  const uploadURL = facultyId ? `${backendURL}/api_resource/create/${facultyId}` : null;

  const validateField = (fieldName, value) => {
    let errors = { ...validationErrors };
    const alphaRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/; // Regex for names (letters, spaces, hyphens)

    switch (fieldName) {
      case 'title':
        if (!value.trim() || value.length < 3) {
          errors[fieldName] = "Title must be at least 3 characters long.";
        } else {
          delete errors[fieldName];
        }
        break;
      case 'authorFirstName':
      case 'authorLastName':
        if (!alphaRegex.test(value)) {
          errors[fieldName] = "Name must contain only letters, spaces, or hyphens.";
        } else {
          delete errors[fieldName];
        }
        break;
      case 'description':
        if (!value.trim() || value.length < 20) {
          errors['description'] = "Description must be at least 20 characters long.";
        } else {
          delete errors['description'];
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'authorFirstName':
        setAuthorFirstName(value);
        break;
      case 'authorLastName':
        setAuthorLastName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    validateField('title', title);
    validateField('authorFirstName', authorFirstName);
    validateField('authorLastName', authorLastName);
    validateField('description', description);

    // Validate file and image fields
    let fileErrors = {};
    if (!file) {
      fileErrors.file = "Document file is required";
    }
    if (!img) {
      fileErrors.img = "Image file is required";
    }
    setValidationErrors(prevErrors => ({ ...prevErrors, ...fileErrors }));

    // Check for any validation errors
    const hasErrors = () => {
      return Object.keys(validationErrors).length > 0 || fileErrors.file || fileErrors.img;
    };

    // Wait for a tick to ensure state updates
    setTimeout(async () => {
      if (hasErrors()) {
        setError('Please correct the errors before submitting.');
        return;
      }

      // Proceed with form submission...
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
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while uploading the document.');
      }
      finally {
        setIsLoading(false); // This will execute after try or catch block
      }
    }, 0);

  };



  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} >
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <Input placeholder="Title" type="text" id="title" name="title" value={title} onChange={handleFieldChange} />
          {validationErrors.title && <div className="error-message">{validationErrors.title}</div>}

          <Input placeholder="Author FirstName" type="text" id="authorFirstName" name="authorFirstName" value={authorFirstName} onChange={handleFieldChange} />
          {validationErrors.authorFirstName && <div className="error-message">{validationErrors.authorFirstName}</div>}

          <Input placeholder="Author LastName" type="text" id="authorLastName" name="authorLastName" value={authorLastName} onChange={handleFieldChange} />
          {validationErrors.authorLastName && <div className="error-message">{validationErrors.authorLastName}</div>}

          <Input placeholder="Description" type="text" id="description" name="description" value={description} onChange={handleFieldChange} />
          {validationErrors.description && <div className="error-message">{validationErrors.description}</div>}

          <Input placeholder="File To upload(PDF)" type="file" id="documentFile" name="file" accept="application/pdf" onChange={handleFileChange} />
          {validationErrors.file && <div className="error-message">{validationErrors.file}</div>}

          <Input placeholder="Related Image" type="file" id="imageFile" name="img" accept="image/jpeg, image/jpg, image/png" onChange={handleImgChange} />
          {validationErrors.img && <div className="error-message">{validationErrors.img}</div>}

          {isLoading && <div>Loading...</div>}

          <div className="modal-footer">
            <button onClick={handleUpload} className="authButton">{isLoading ? 'Uploading...' : 'Upload'}</button>
            <button onClick={closeModal} className="authButton">Close</button>

          </div>
        </Modal>
      )}
    </>
  );
};

export default FileUpload;

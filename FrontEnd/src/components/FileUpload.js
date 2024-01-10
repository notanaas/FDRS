import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import Modal from './Modal';
import { RouteParamsContext } from './context/RouteParamsContext';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

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

  const convertPdfToImage = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        console.log('File loaded, starting PDF.js getDocument...');
  
        getDocument(typedArray).promise.then(pdf => {
          console.log('PDF loaded, getting first page...');
          pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const ctx = canvas.getContext('2d');
  
            console.log('Rendering page...');
            page.render({ canvasContext: ctx, viewport: viewport }).promise.then(() => {
              console.log('Page rendered, creating blob...');
              canvas.toBlob(blob => {
                console.log('Blob created, resolving promise...');
                resolve(blob);
              }, 'image/jpeg');
            });
          });
        }).catch(error => {
          console.error('Error in PDF.js getDocument or getPage:', error);
          reject(error);
        });
      };
  
      fileReader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
  
      fileReader.readAsArrayBuffer(file);
    });
  };
  
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
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size should be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError(''); // Reset error message
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
  
    // Validation errors setup for files
    let fileErrors = {};
    if (!file) {
      fileErrors.file = "Document file is required";
    }
    setValidationErrors(prevErrors => ({ ...prevErrors, ...fileErrors }));
  
    const hasErrors = () => {
      // The form has errors if there are validation errors or if the file is missing
      return Object.keys(validationErrors).length > 0 || fileErrors.file;
    };
  
    if (hasErrors()) {
      setError('Please correct the errors before submitting.');
      setIsLoading(false);
      return;
    }
  
    let coverImageFile = null; // Initialize coverImageFile to null
  
    // If there's no image but there is a PDF file, convert the first page to an image
    if (!img && file) {
      try {
        const coverImageBlob = await convertPdfToImage(file);
        coverImageFile = new File([coverImageBlob], 'cover.jpg', { type: 'image/jpeg' });
        setImg(coverImageFile); // Update the state to reflect the new cover image
      } catch (conversionError) {
        setError("Error converting PDF to image");
        setIsLoading(false);
        return;
      }
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('firstname', authorFirstName);
    formData.append('lastname', authorLastName);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('img', coverImageFile || img);
  
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
        setSuccessMessage(isAdmin ? 'Document uploaded successfully' : 'Document uploaded successfully waiting for approval');
       
      }
    } catch (uploadError) {
      if (uploadError.response && uploadError.response.data) {
        const responseData = uploadError.response.data;
        if (responseData.message && responseData.message.includes('title already exists')) {
          setError('A document with this title already exists. Please use a different title.');
        } else if (responseData.errors) {
          const titleError = responseData.errors.find(err => err.param === 'title');
          if (titleError) {
            setError(titleError.msg);
          } else {
            setError('An unexpected error occurred');
          }
        } else {
          setError('An error occurred while uploading. Please try again.');
        }
      } else {
        setError('An error occurred while uploading. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
    
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal 
  isOpen={isModalOpen} 
  onClose={closeModal} 
>        {error && <div className="error-message">{error}</div>}
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
            <button onClick={handleUpload} className="authButton" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FileUpload;

import React, { useState, useEffect } from 'react';
import { useFaculty } from './context/FacultyContext';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
const Modal = ({ isOpen, onClose, children, isDarkMode }) => {
  const modalContentStyle = {
    backgroundColor: isDarkMode ? '#333' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <div 
      className="upload-modal" 
      style={{ display: isOpen ? 'flex' : 'none' }} 
      onClick={onClose}
    >
      <div 
        className="upload-modal-content" 
        style={modalContentStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ backgroundColor: '#8b0000' }} />
        <div className="modal-body">{children}</div>
        <div className="modal-footer" />
      </div>
    </div>
  );
};
const FacultyPage = () => {
  const apiEndpoint = 'http://localhost:3002/api_resource/create/6522b2eb6f293d94d943256a';
  const userToken = localStorage.getItem('token');
  const { facultyName } = useFaculty();
  const { FacultyName } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(!!userToken);
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [favoriteResources, setFavoriteResources] = useState([]);
  const [isStarActive, setIsStarActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ message: '', type: 'success' });

  // Effects
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('/verifyToken', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {
          setIsLoggedIn(true);
        }).catch(error => {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        });
      }
     
    
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeChangeListener = (e) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    darkModeMediaQuery.addEventListener('change', darkModeChangeListener);

    return () => darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
  }, []);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleAddFavorite = async (resourceId) => {
    try {
      await axios.post(`${apiEndpoint}/favorite/resources/${resourceId}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      fetchFavoriteResources();
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleRemoveFavorite = async (resourceId) => {
    try {
      await axios.delete(`${apiEndpoint}/favorite/resources/${resourceId}/unfavorite`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      fetchFavoriteResources();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorFirstNameChange = (e) => {
    setAuthorFirstName(e.target.value);
  };
  const handleAuthorLastNameChange = (e) => {
    setAuthorLastName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const uniqueId = uuidv4();
      const fileName = `${uniqueId}_${selectedFile.name}`;
      const uploadUrl = `${apiEndpoint}/${fileName}`;
      setFile(uploadUrl);
    }
  };

  const handleImgChange = (file) => {
    setImg(file);
    const photoUrl = URL.createObjectURL(file);
    setImgUrl(photoUrl);
  };

  const handleUpload = async () => {
    if (!isLoggedIn) {
      setAlertMessage({
        message: 'You need to be logged in to upload documents.',
        type: 'error',
      });
      return;
    }
    
    if (title && authorFirstName && authorLastName && description && file && img) {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('firstname', authorFirstName); // Changed from authorFirstName to firstname
        formData.append('lastname', authorLastName); // Changed from authorLastName to lastname
        formData.append('description', description);
        formData.append('img', img); // This should be the actual image file, not a path
        formData.append('file', file); // This should be the actual file object, not a path
     
        
  
        const response = await axios.post(apiEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        });
  
        if (response.status === 201) { // Assuming 201 means created
          setSuccessMessage('Document uploaded successfully');
          // Reset form and clear errors
          setTitle('');
          setAuthorFirstName('');
          setAuthorLastName('');
          setDescription('');
          setImg(null);
          setFile(null);
          setError(null);
        } else {
          setError('Upload failed. Please try again later.');
        }
      } catch (error) {
        
        const message = error.response?.data?.error || 'An error occurred while uploading the document. Please try again later.';
        setError(message);
        console.error('Error uploading document:', message);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };
  

  

  const fetchFavoriteResources = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/favorite/resources`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setFavoriteResources(response.data);
    } catch (error) {
      console.error('Error fetching favorite resources:', error);
    }
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header selectedFacultyName={facultyName} isFacultyPage={true} />
      <h1 style={{ marginTop: '120px' }}>{FacultyName}</h1>
      <button onClick={() => setIsModalOpen(true)} className="authButton">Upload</button>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode}>
            <div className="custom-upload-modal">
          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="success-message">
              <p className="success-text">{successMessage}</p>
            </div>
          )}

          <div className="form-container">
          <label htmlFor="username"><h1>Upload File</h1></label>

  <div className="form-group">
    <label>Title:</label>
    <input
      type="text"
      name="title"
      value={title}
      onChange={handleTitleChange}
      className="inputBar"
    />
  </div>
  <div className="form-group">
    <label>Author First Name:</label>
    <input
      type="text"
      name="authorFirstName"
      value={authorFirstName}
      onChange={handleAuthorFirstNameChange}
      className="inputBar"
    />
  </div>
  <div className="form-group">
    <label>Author Last Name:</label>
    <input
      type="text"
      name="authorLastName"
      value={authorLastName}
      onChange={handleAuthorLastNameChange}
      className="inputBar"
    />
  </div>
  <div className="form-group">
    <label>Description:</label>
    <textarea
      name="description"
      value={description}
      onChange={handleDescriptionChange}
      className="inputBar"
    ></textarea>
  </div>
  <div className="form-group">
    <label>Choose Document (PDF):</label>
    <input
      type="file"
      accept="application/pdf"
      onChange={handleFileChange}
      className="inputBar"
    />
  </div>
  <div className="form-group">
    <label>Choose Photo for Document (JPEG, JPG, PNG):</label>
    <input
      type="file"
      accept="image/jpeg, image/jpg, image/png"
      onChange={(e) => handleImgChange(e.target.files[0])}
      className="inputBar"
    />
  </div>
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
                <button onClick={closeModal} className="authButton">
                  Close
                </button>
                <button onClick={handleUpload} className="authButton">
                  Upload
                </button>
              </div>
              {alertMessage.message && (
                <div className={`alert-message ${alertMessage.type}`}>
                  {alertMessage.message}
                </div>
              )}
            </div>
        </Modal>
      )}

      {uploadedDocuments.length > 0 && (
        <div>
          <ul className={`card-container ${isDarkMode ? 'dark' : 'light'}`}>
            {uploadedDocuments.map((item, index) => (
              <li key={index} className="card">
                <Link to={`/resource/${item.id}`}>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">Author: {item.author}</p>
                  <p className="card-description">Description: {item.description}</p>
                </Link>
                {item.img && (
                  <div>
                    <img
                      className="uploaded-photo"
                      src={item.photo}
                      alt="Document or Link"
                    />
                  </div>
                )}
                <div className="authButton">
                  {item.file && (
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={item.title || 'document'}
                      className="authButton"
                    >
                      Download Document
                    </a>
                  )}
                </div>
                <div className="share-buttons">
                  <FacebookShareButton url={item.link || ''}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={item.link || ''}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={item.link || ''}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <EmailShareButton url={item.link || ''}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
                <i
                  className={`fas fa-star${isStarActive ? ' active' : ''}`}
                  onClick={() => isStarActive ? handleRemoveFavorite(item.id) : handleAddFavorite(item.id)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
      )}
      {favoriteResources.length > 0 && (
        <div>
          <h2>Your Favorite Resources</h2>
          <ul className={`card-container ${isDarkMode ? 'dark' : 'light'}`}>
            {favoriteResources.map((item, index) => (
              <li key={index} className="card">
                <Link to={`/resource/${item.id}`}>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">Author: {item.author}</p>
                  <p className="card-description">Description: {item.description}</p>
                </Link>
                {item.photo && (
                  <div> <img className="uploaded-photo" src={item.photo} alt="Document or Link" /></div>
                )}
                <div className="download-button-container">
                  {item.file && (
                    <a href={item.file} target="_blank" rel="noopener noreferrer" download={item.title || 'document'} className="download-button">
                      Download Document
                    </a>
                  )}
                </div>
                <div className="share-buttons">
                  <FacebookShareButton url={item.link || ''}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={item.link || ''}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={item.link || ''}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <EmailShareButton url={item.link || ''}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
                <i
                  className="fas fa-star active"
                  onClick={() => handleRemoveFavorite(item.id)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default FacultyPage;
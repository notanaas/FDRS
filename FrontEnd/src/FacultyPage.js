import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useParams, Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Header from './Header';
import Footer from './Footer';
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

const FacultyPage = () => {
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setfile] = useState(null);
  const [img, setimg] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [imgUrl, setimgUrl] = useState('');
  const { facultyName } = useFaculty();
  const { FacultyName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileUrl, setfileUrl] = useState('');
  const [favoriteResources, setFavoriteResources] = useState([]);
  const [isStarActive, setIsStarActive] = useState(false);

  const apiEndpoint = 'http://localhost:3002/api_resource/create/6522b2eb6f293d94d943256a';
  const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1MzIyNWNjM2NiMzc4ZmRmZTAwYmQ4NyIsInVzZXJuYW1lIjoiYW5hczIiLCJlbWFpbCI6ImFuYXMyQGdtYWlsLmNvbSJ9LCJpYXQiOjE2OTc3ODYzODIsImV4cCI6MTY5Nzg3Mjc4Mn0.4SPCW_xL3IkKasiMLZhJxjrHpN1kTci6ofgsBRX8hR0'; 

  const fetchDocuments = async (facultyName) => {
    try {
      const response = await axios.get(`${apiEndpoint}/api_resource/resources/${facultyName}`);
      setUploadedDocuments(response.data.Resource_list);
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
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

  useEffect(() => {
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

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
    };
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

  const handlefileChange = (file) => {
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${file.name}`;
    const uploadUrl = `${apiEndpoint}/${fileName}`;
    //setfileUrl(uploadUrl);
  };

  const handleimgChange = (file) => {
    setimg(file);
    const photoUrl = URL.createObjectURL(file);
    setimgUrl(photoUrl);
  };

  const handleUpload = async () => {
    if (title && authorFirstName && authorLastName&& description && img) {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('authorFirstName', authorFirstName);
        formData.append('authorLastName', authorLastName);
        formData.append('description', description);
        formData.append('photo', img);
        formData.append('file', file);

        const response = await axios.post(apiEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' :`Bearer ${userToken}` 
          },
        });

        if (response.data.success) {
          setSuccessMessage('Document uploaded successfully');

          // Clear the success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);

          setTitle('');
          setAuthorFirstName('');
          setAuthorLastName('');
          setDescription('');
          setimg(null);
          setfile(null);
          setError(null);
        } else {
          setError('Upload failed. Please try again later.');
        }
      } catch (error) {
        setError('An error occurred while uploading the document. Please try again later.');
        console.error('Error uploading document:', error);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header selectedFacultyName={facultyName} isFacultyPage={true} />
      <h1>{FacultyName}</h1>
      <button onClick={openModal} className="upload-button">
        Upload
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} isDarkMode={isDarkMode}>
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

          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={handleTitleChange} /><br></br>
            <label>Author first name:</label>
            <input type="text" value={authorFirstName} onChange={handleAuthorFirstNameChange} /><br></br>
            <label>Author last name:</label>
            <input type="text" value={authorLastName} onChange={handleAuthorLastNameChange} /><br></br>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Description"
              rows="5"
              style={{ width: '100%', resize: 'none' }}
            ></textarea>
            <label>Choose Document:</label>
            <input
              type="file"
              accept="pdf"
              onChange={(e) => handlefileChange(e.target.files[0])}
            />
            <label>Choose Photo for Document:</label>
            <input
              type="file"
              accept="jpeg,jpg,png"
              onChange={(e) => handleimgChange(e.target.files[0])}
            />
            {imgUrl && (
              <div className="card">
                <img className="uploaded-photo" src={imgUrl} alt="Document" />
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">Author First Name: {authorFirstName}</p>
                  <p className="card-text">Author Last Name: {authorLastName}</p>
                  <p className="card-description">Description: {description}</p>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={closeModal} className="modal-close-button">
              Close
            </button>
            <button onClick={handleUpload} className="upload-button">
              Upload
            </button>
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
                {item.photo && (
                  <div>
                    <img
                      className="uploaded-photo"
                      src={item.photo}
                      alt="Document or Link"
                    />
                  </div>
                )}
                <div className="download-button-container">
                  {item.file && (
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={item.title || 'document'}
                      className="download-button"
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
            {favoriteResources.map((item , index) => (
              <li key={index} className="card">
                <Link to={`/resource/${item.id}`}>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">Author: {item.author}</p>
                  <p className="card-description">Description: {item.description}</p>
                </Link>
                {item.photo && (
  <div>
    <img
      className="uploaded-photo"
      src={item.photo}
      alt="Document or Link"
    />
  </div>
)}


                <div className="download-button-container">
                  {item.file && (
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={item.title || 'document'}
                      className="download-button"
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
                  className="fas fa-star active" onClick={() => handleRemoveFavorite(item.id)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FacultyPage;

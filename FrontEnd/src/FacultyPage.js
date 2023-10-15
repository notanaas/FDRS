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
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState('');
  const { facultyName } = useFaculty();
  const { FacultyName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStarActive, setIsStarActive] = useState(false);
  const [documentFileUrl, setDocumentFileUrl] = useState('');
  const [favoriteResources, setFavoriteResources] = useState([]);

  const apiEndpoint = 'http://localhost:3000';
  const userToken = 'http://localhost:3000'; 

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

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDocumentFileChange = (file) => {
    const uniqueId = uuidv4();
    const documentFileName = `${uniqueId}_${file.name}`;
    const uploadUrl = `/your_upload_endpoint/${documentFileName}`;
    setDocumentFileUrl(uploadUrl);
  };

  const handleDocumentPhotoChange = (file) => {
    setDocumentPhoto(file);
    const photoUrl = URL.createObjectURL(file);
    setDocumentPhotoUrl(photoUrl);
  };

  const handleUpload = async () => {
    if (title && author && description && documentPhoto) {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('description', description);
        formData.append('photo', documentPhoto);
        formData.append('file', documentFile);

        const response = await axios.post(`${apiEndpoint}/api_resource/resource/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setSuccessMessage('Document uploaded successfully');
          setTitle('');
          setAuthor('');
          setDescription('');
          setDocumentPhoto(null);
          setDocumentFile(null);
          alert('Resource has been uploaded successfully!');
          closeModal();
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
          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={handleTitleChange} /><br></br>
            <label>Author:</label>
            <input type="text" value={author} onChange={handleAuthorChange} /><br></br>
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
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleDocumentFileChange(e.target.files[0])}
            />
            <label>Choose Photo for Document:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDocumentPhotoChange(e.target.files[0])}
            />
            {documentPhotoUrl && (
              <div className="card">
                <img className="uploaded-photo" src={documentPhotoUrl} alt="Document" />
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">Author: {author}</p>
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

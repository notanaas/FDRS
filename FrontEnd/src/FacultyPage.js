import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useParams, Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Header from './Header';
import Footer from './Footer';
import ResourcePage from './ResourcePage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
  const [mode] = useState('light');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [uploadChoice] = useState('document');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]); // Store the uploaded documents
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState('');
  const { facultyName } = useFaculty();
  const { FacultyName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStarActive, setIsStarActive] = useState(false);
  const [documentFileUrl, setDocumentFileUrl] = useState('');

  const apiEndpoint = 'http://localhost:3007'; // Replace with your backend API URL
  const frontendURL = 'http://localhost:3000'; // Replace with your frontend URL

  useEffect(() => {
    axios
      .get(`${apiEndpoint}/api/resource`, {
        headers: {
          'Origin': frontendURL,
        },
      })
      .then((response) => {
        console.log('Response from backend:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const CustomCopyLinkButton = ({ url }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = () => {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
    };

    return (
      <button
        className={`custom-copy-button ${isCopied ? 'copied' : ''}`}
        onClick={handleCopyLink}
      >
        {isCopied ? 'Copied!' : <img src="/link.png" alt="Copy Link" style={{ width: '20px', height: '20px' }} />}
      </button>
    );
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
    console.log('Attempting to upload...');
    if (uploadChoice === 'document' && title && author && description && documentPhoto) {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('description', description);
        formData.append('photo', documentPhoto);
        formData.append('file', documentFile);

        const response = await axios.post(`${apiEndpoint}/api/resource/create`, formData, {
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
          // Show an alert here
          alert('Resource has been uploaded successfully!');
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

  const fetchDocuments = async (facultyName) => {
    try {
      const response = await axios.get(`${apiEndpoint}/api/resources/${facultyName}`);
      setUploadedDocuments(response.data.Resource_list); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
    }
  };
  
  // Call fetchDocuments with the selected facultyName
  useEffect(() => {
    const selectedFacultyName = "Information Technology"; // Replace with the selected faculty name
    fetchDocuments(selectedFacultyName);
  }, []);

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
            <div
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                padding: '12px 20px',
                margin: '10px 0',
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {uploadChoice === 'document' ? (
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
          ) : (
            <div></div>
          )}
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
      {/* Render the uploaded documents */}
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
                  <CustomCopyLinkButton url={item.link || ''} />
                </div>
                <i className={`fas fa-star${isStarActive ? ' active' : ''}`} onClick={() => setIsStarActive(!isStarActive)}></i>
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

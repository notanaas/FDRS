import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useParams, Link } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Header from './Header';
import Footer from './Footer';
import ResourcePage from './ResourcePage'; // Import ResourcePage
import '@fortawesome/fontawesome-free/css/all.min.css';
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
  const [description, setDescription] = useState(''); // New description state
  const [uploadChoice] = useState('document');
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

  const CustomCopyLinkButton = ({ url }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = () => {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      // You can add additional logic or UI updates here after copying the link
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

  const handleDescriptionChange = (e) => { // New handler for description input
    setDescription(e.target.value);
  };

  const handleDocumentFileChange = (file) => {
    setDocumentFile(file);
  };

  const handleDocumentPhotoChange = (file) => {
    setDocumentPhoto(file);
    const photoUrl = URL.createObjectURL(file);
    setDocumentPhotoUrl(photoUrl);
  };

  const handleUpload = () => {
    if (uploadChoice === 'document' && title && author && description && documentPhoto) { // Check description
      const uploadedDocument = {
        title,
        author,
        description, // Include description in the uploaded document
        photo: documentPhotoUrl
      };
      setUploadedDocuments([...uploadedDocuments, uploadedDocument]);
      setTitle('');
      setAuthor('');
      setDescription('');
      setDocumentFile(null);
      setDocumentPhoto(null);
      setDocumentPhotoUrl('');
      setSuccessMessage('Document uploaded successfully.');
      setIsModalOpen(false);
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
        <div className={`modalContainer-${mode}`}>
          <modalContainer>
            <modalContent>
              <h2>Upload Document</h2>
              <button onClick={closeModal}>Close</button>
            </modalContent>
          </modalContainer>
        </div>
      )}
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
            <input type="text" value={title} onChange={handleTitleChange} />
            <br />
            <label>Author:</label>
            <input type="text" value={author} onChange={handleAuthorChange} />
            <label>Description:</label>
            <input type="text" value={description} onChange={handleDescriptionChange} /> {/* Add description input */}
            <br />
            <label>Choose Document:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleDocumentFileChange(e.target.files[0])}
            />
            <br />
            <label>Choose Photo for Document:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDocumentPhotoChange(e.target.files[0])}
            />
            <br />
            {documentPhotoUrl && (
              <div className="card">
                <img
                  className="uploaded-photo"
                  src={documentPhotoUrl}
                  alt="Document"
                />
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">Author: {author}</p>
                  <p className="card-description">Description: {description}</p> {/* Display description */}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: '#8b0000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Upload
        </button>
      </Modal>
      <ResourcePage uploadedDocuments={uploadedDocuments} />

      <div>
        <ul className="card-container">
          {uploadedDocuments.map((item, index) => (
            <li key={index} className="card">
              <Link to={`/resource/${index}`}>
                <h3>{item.title}</h3>
                <p>Author: {item.author}</p>
                <p>Description: {item.description}</p> {/* Display description */}
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
              {item.file ? (
                <div>
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={item.title || 'document'}
                  >
                    Download Document
                  </a>
                </div>
              ) : null}
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
                <CustomCopyLinkButton url={item.link || ''} imageSrc="%PUBLIC_URL%/link.ico"/>
              </div>
              <i className={`fas fa-star${isStarActive ? ' active' : ''}`} onClick={() => setIsStarActive(!isStarActive)}></i>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default FacultyPage;

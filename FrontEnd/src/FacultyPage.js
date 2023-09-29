import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useParams } from 'react-router-dom';
import { useFaculty } from './FacultyContext';
import Header from './Header';
import Footer from './Footer';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon, // Import FacebookIcon here
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

const FacultyPage = () => {
  const [mode] = useState('light');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [link, setLink] = useState('');
  const [uploadChoice, setUploadChoice] = useState('document');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [linkPhoto, setLinkPhoto] = useState(null);
  const [linkDescription, setLinkDescription] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState('');
  const [linkPhotoUrl, setLinkPhotoUrl] = useState('');
  const { facultyName } = useFaculty();
  const { FacultyName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the system prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    // Set the initial dark mode state based on system preferences
    setIsDarkMode(prefersDarkMode);
  
    // Add a listener for changes in system preferences
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const darkModeChangeListener = (e) => {
      // Update the state based on system preferences
      setIsDarkMode(e.matches);
  
      // Apply or remove the 'dark' class to toggle dark mode
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  
    darkModeMediaQuery.addEventListener('change', darkModeChangeListener);
  
    // Clean up the listener when the component unmounts
    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeListener);
    };
  }, []); // Ensure that this effect runs only once when the component mounts
  
  
  
    

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setLinkDescription('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleUploadChoiceChange = (choice) => {
    setUploadChoice(choice);
  };

  const handleDocumentFileChange = (file) => {
    setDocumentFile(file);
  };

  const handleDocumentPhotoChange = (file) => {
    setDocumentPhoto(file);
    const photoUrl = URL.createObjectURL(file);
    setDocumentPhotoUrl(photoUrl);
  };

  const handleLinkPhotoChange = (file) => {
    setLinkPhoto(file);
    const photoUrl = URL.createObjectURL(file);
    setLinkPhotoUrl(photoUrl);
  };

  const handleLinkDescriptionChange = (e) => {
    setLinkDescription(e.target.value);
  };

  const handleShare = (item) => {
    console.log(`Sharing document: ${item.title}`);
  };

  const handleUpload = () => {
    if (uploadChoice === 'document' && title && author  && documentPhoto) {
      const uploadedDocument = {
        title,
        author,
        photo: documentPhotoUrl,
      };
      setUploadedDocuments([...uploadedDocuments, uploadedDocument]);
      setTitle('');
      setAuthor('');
      setDocumentFile(null);
      setDocumentPhoto(null);
      setDocumentPhotoUrl('');
      setSuccessMessage('Document uploaded successfully.');
      setIsModalOpen(false);
    } else if (uploadChoice === 'link' && link && linkPhoto && linkPhotoUrl) {
      const uploadedLink = {
        link,
        photo: linkPhotoUrl,
        description: linkDescription,
      };
      setUploadedDocuments([...uploadedDocuments, uploadedLink]);
      setLink('');
      setLinkPhoto(null);
      setLinkDescription('');
      setLinkPhotoUrl('');
      setSuccessMessage('Link uploaded successfully.');
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
              <h2>Upload Document or Link</h2>
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
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
         
          </div>
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
      <div>
      <ul className="card-container">
  {uploadedDocuments.map((item, index) => (
    <li key={index} className="card">
      {item.title && (
        <div className="card-title">
          <strong>Title:</strong> {item.title}
        </div>
      )}
      {item.author && (
        <div className="card-text">
          <strong>Author:</strong> {item.author}
        </div>
      )}
      {item.file && (
        <div>
          <a
            href={
              item.file instanceof Blob
                ? URL.createObjectURL(item.file)
                : item.file
            }
            target="_blank"
            rel="noopener noreferrer"
            download={item.title || 'document'}
          >
            View/Download Document
          </a>
        </div>
      )}
      {item.photo && (
        <div>
          <img
            className="uploaded-photo"
            src={item.photo}
            alt="Document or Link"
          />
        </div>
      )}
      {item.description && (
        <div className="card-description">
          <strong>Description:</strong> {item.description}
        </div>
      )}
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
    </li>
  ))}
        </ul>
      </div>
      <Footer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default FacultyPage;

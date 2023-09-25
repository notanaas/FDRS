import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { useParams } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import Header from './Header'; // Import the Header component

const SubjectPageContainer = styled.div`
  padding: 20px;
`;

const SubjectPage = () => {
  const { subjectName } = useParams(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
  // ... (other state variables)


  const SubjectPageHeader = styled.h1`
  /* Your header styles here */
`;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [link, setLink] = useState('');
  const [uploadChoice, setUploadChoice] = useState('document');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPhoto, setDocumentPhoto] = useState(null); // State for document photo
  const [linkPhoto, setLinkPhoto] = useState(null);
  const [linkDescription, setLinkDescription] = useState(''); // State for link description
  const [error, setError] = useState(null); // State to hold error message
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const [uploadedDocuments, setUploadedDocuments] = useState([]); // State to store uploaded documents
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState(''); // State to store the document photo URL
  const [linkPhotoUrl, setLinkPhotoUrl] = useState(''); // State to store the link photo URL

  const openModal = () => {
    setIsModalOpen(true);
  };
  const onUploadClick = () => {
    openModal();
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear any previous error messages when closing the modal
    setLinkDescription(''); // Clear the link description
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
    // Generate a URL for the document photo
    const photoUrl = URL.createObjectURL(file);
    setDocumentPhotoUrl(photoUrl);
  };

  const handleLinkPhotoChange = (file) => {
    setLinkPhoto(file);

    // Generate a URL for the link photo
    const photoUrl = URL.createObjectURL(file);
    setLinkPhotoUrl(photoUrl);
  };

  const handleLinkDescriptionChange = (e) => {
    setLinkDescription(e.target.value);
  };

  const handleUpload = () => {
    if (uploadChoice === 'document' && title && author && documentFile && documentPhoto) {
      // Simulate storing the uploaded document
      const uploadedDocument = {
        title,
        author,
        file: documentFile,
        photo: documentPhotoUrl,
      };

      // Add the uploaded document to the list
      setUploadedDocuments([...uploadedDocuments, uploadedDocument]);

      // Reset form fields
      setTitle('');
      setAuthor('');
      setDocumentFile(null);
      setDocumentPhoto(null);
      setDocumentPhotoUrl('');

      // Display success message
      setSuccessMessage('Document uploaded successfully.');

      // Close the modal
      setIsModalOpen(false);
    } else if (uploadChoice === 'link' && link && linkPhoto && linkPhotoUrl) {
      // Simulate storing the uploaded link
      const uploadedLink = {
        link,
        photo: linkPhotoUrl,
        description: linkDescription, // Add the description
      };

      // Add the uploaded link to the list
      setUploadedDocuments([...uploadedDocuments, uploadedLink]);

      // Reset form fields
      setLink('');
      setLinkPhoto(null);
      setLinkDescription('');
      setLinkPhotoUrl('');

      // Display success message
      setSuccessMessage('Link uploaded successfully.');

      // Close the modal
      setIsModalOpen(false);
    } else {
      // Display an error message if any required fields are empty
      setError('Please fill in all required fields.');
    }
  };




  return (
    <div>
      <h1>{subjectName}</h1>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Upload Document or Link</h2>
        {error && <ErrorMessage message={error} />}
        {successMessage && (
          <div
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 20px',
              margin: '10px 0',
              borderRadius: '6px',
            }}
          >
            {successMessage}
          </div>
        )}
        <div>
          <label>Select Upload Type:</label>
          <br />
          <input
            type="radio"
            id="document"
            name="uploadType"
            value="document"
            checked={uploadChoice === 'document'}
            onChange={() => handleUploadChoiceChange('document')}
          />
          <label htmlFor="document">Document</label>
          <br />
          <input
            type="radio"
            id="link"
            name="uploadType"
            value="link"
            checked={uploadChoice === 'link'}
            onChange={() => handleUploadChoiceChange('link')}
          />
          <label htmlFor="link">Link</label>
        </div>

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
            <label>Link:</label>
            <input type="text" value={link} onChange={handleLinkChange} />
            <br />
            <label>Choose Photo for Link:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLinkPhotoChange(e.target.files[0])}
            />
            <br />
            <label>Description:</label>
            <input
              type="text"
              value={linkDescription}
              onChange={handleLinkDescriptionChange}
            />
            <br />
            {linkPhotoUrl && (
              <div className="card">
                <img
                  className="uploaded-photo"
                  src={linkPhotoUrl}
                  alt="Link"
                />
                <div className="card-body">
                  <h5 className="card-title">Link</h5>
                  <p className="card-text">Description: {linkDescription}</p>
                </div>
              </div>
            )}
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
              {item.title && <div className="card-title">{item.title}</div>}
              {item.author && <div className="card-text">Author: {item.author}</div>}
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
                  {item.photo && <img src={item.photo} alt="Document" />}
                </div>
              )}
              {item.link && (
                <div>
                  <div className="card-text">Link: {item.link}</div>
                  {item.description && (
                    <div className="card-text">Description: {item.description}</div>
                  )}
                  {item.photo && <img src={item.photo} alt="Link" />}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Centered "Upload" button at the bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={onUploadClick} className="upload-button">Upload</button>
      </div>
    </div>
  );
};

export default SubjectPage;

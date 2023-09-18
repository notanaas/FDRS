import React, { useState } from 'react';
import Modal from './Modal';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Define styled components for the radio buttons
const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const RadioLabel = styled.span`
  font-size: 1rem;
  margin-bottom: 5px;
`;

const RadioButton = styled.input`
  margin-right: 5px;

  &:checked + ${RadioLabel} {
    color: #8b0000;
    font-weight: bold;
  }
`;

const SubjectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [link, setLink] = useState('');
  const [uploadChoice, setUploadChoice] = useState('document');

  const { subjectName } = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleUpload = () => {
    if (uploadChoice === 'document' && title && author) {
      // Handle document upload
      alert('Document uploaded successfully.');
    } else if (uploadChoice === 'link' && link) {
      // Handle link upload
      alert('Link uploaded successfully.');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div>
      <h1>{subjectName}</h1>
      <button
        onClick={openModal}
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
  <h2>Upload Document or Link</h2>
  <form onSubmit={handleUpload}>
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
        <label>Choose File:</label>
        <input type="file" />
      </div>
    ) : (
      <div>
        <label>Link:</label>
        <input type="text" value={link} onChange={handleLinkChange} />
      </div>
    )}

  </form>
</Modal>

    </div>
  );
};

export default SubjectPage;

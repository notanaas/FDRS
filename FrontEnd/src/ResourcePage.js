// ResourcePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Comments from './Comments';
import axios from 'axios';
import './App.css';

const ResourcePage = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const { resourceId } = useParams();

  // Sample resource data
  const resource = {
    title: 'Sample Resource',
    author: 'John Doe',
    description: 'This is a sample resource.',
    photo: process.env.PUBLIC_URL + '/photo.jpg',
    file: process.env.PUBLIC_URL + '/pdf.pdf',
  };

  const authorNameParts = resource.author.split(' ');
  const authorFirstName = authorNameParts[0];
  const authorLastName = authorNameParts.slice(1).join(' ');

  // Sample comments data
  const [comments, setComments] = useState([
    { id: 1, author: 'User 1', text: 'This is a comment', timestamp: new Date() },
    // Add more comments here
  ]);

  const [commentsContainerHeight, setCommentsContainerHeight] = useState('auto');

  useEffect(() => {
    // Check the user's authentication status and fetch user name
    axios.get('/api/auth/check-auth')
      .then((response) => {
        setUserAuthenticated(true);
        setUserName(response.data.userName);
      })
      .catch((error) => {
        setUserAuthenticated(false);
      });
  }, []);

  const adjustCommentsContainerHeight = () => {
    const maxHeight = '400px'; // Adjust this as needed
    setCommentsContainerHeight(maxHeight);
  };

  const addComment = (newComment) => {
    if (userAuthenticated) {
      // Check if the user is authenticated before adding a comment
      if (newComment.author && newComment.text) {
        const timestamp = new Date();
        const newCommentObj = {
          id: comments.length + 1,
          author: userName, // Use the authenticated user's name
          text: newComment.text,
          timestamp: timestamp,
        };

        setComments([newCommentObj, ...comments]);
      }
    } else {
      alert('You need to log in to add a comment.');
    }
  };

  return (
    <div className="resource-page">
      <Header />
      <div className="resource-content">
        <div className="resource-title">{resource.title}</div>
        <div className="resource-author">
          <p>
            <strong>Author:</strong><br />
            {authorFirstName} {authorLastName}
          </p>
        </div>
        <div className="resource-description">
          {resource.description && (
            <div>
              <strong>Description:</strong> {resource.description}
            </div>
          )}
        </div>
        <div className="resource-image">
          {resource.photo && <img src={resource.photo} alt="Document" width="300" />}
        </div>
        <div className="resource-download">
          {resource.file ? (
            <a
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.title || 'document'}
            >
              Download Document
            </a>
          ) : null}
        </div>
      </div>
      <div className="comments-container" style={{ maxHeight: commentsContainerHeight, overflowY: 'auto' }}>
        <Comments comments={comments} addComment={addComment} userAuthenticated={userAuthenticated} />
      </div>
      <Footer />
    </div>
  );
};

export default ResourcePage;

// ResourcePage.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './App.css';
const Comments = ({ comments, addComment, userAuthenticated }) => {
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [sortingAsc, setSortingAsc] = useState(true);

  const handleAuthorChange = (e) => {
    setNewComment({ ...newComment, author: e.target.value });
  };

  const handleTextChange = (e) => {
    setNewComment({ ...newComment, text: e.target.value });
  };

  const addNewComment = () => {
    addComment(newComment);
    setNewComment({ author: '', text: '' });
  };

  const sortComments = () => {
    const sortedComments = [...comments].sort((a, b) => {
      if (sortingAsc) {
        return a.timestamp - b.timestamp;
      } else {
        return b.timestamp - a.timestamp;
      }
    });
    setSortingAsc(!sortingAsc);
    addComment(sortedComments);
  };
  return (
    <div className="comments">
      <h2>Comments</h2>
      <div className="sort-comments">
        <button className="authButton" onClick={sortComments}>
          Sort by Date ({sortingAsc ? 'Newer to Older' : 'Older to Newer'})
        </button>
      </div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <strong>{comment.author}:</strong> {comment.text}
        </div>
      ))}
      <div className="add-comment">
        <h3>Add a Comment</h3>
        <div className="comment-form">
          {userAuthenticated ? (
            <>
              <input
                className="inputBar"
                type="text"
                placeholder="Name"
                value={newComment.author}
                onChange={handleAuthorChange}
              />
              <textarea
                className="inputBar"
                placeholder="Write your comment..."
                value={newComment.text}
                onChange={handleTextChange}
              />
              <button className="authButton" onClick={addNewComment}>
                Add Comment
              </button>
            </>
          ) : (
            <p>Please log in to add a comment.</p>
          )}
        </div>
      </div>
    </div>
  );
};
const ResourcePage = () => {
  const userToken = localStorage.getItem('token');
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!userToken);


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

  const [commentsContainerHeight] = useState('auto');

  useEffect(() => {
    // Check local storage for an existing token
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token with the backend to ensure it's still valid
      axios.get('/verifyToken', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        // If token is verified, set login state
        setIsLoggedIn(true);
      }).catch(error => {
        // If token is not valid, handle accordingly, perhaps by logging out
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        // Redirect to login or do something else
      });
    }
  }, []);
  

  
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Set the axios default header with the token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Check the user's authentication status with the token
      axios.get('/api/auth/check-auth')
        .then((response) => {
          // If the token is valid, the API should return a successful response
          setUserAuthenticated(true);
          setUserName(response.data.userName);
        })
        .catch((error) => {
          // If the token is invalid or expired, remove it and set authentication to false
          console.error(error);
          localStorage.removeItem('token');
          setUserAuthenticated(false);
        });
    }
  }, []);

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
    </div>
  );
};

export default ResourcePage;
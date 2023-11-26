import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Comments from './Comments';
import { AuthContext } from './context/AuthContext';
import './App.css';

const ResourcePage = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const { authToken, isLoggedIn, isAdmin } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_resource/resource-detail/${resourceId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResource(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching resource details:', error);
      }
    };
    fetchResourceDetails();
  }, [resourceId, authToken, backendURL]);

  const addComment = async (newComment) => {
    if (!isLoggedIn) {
      alert('You need to log in to add a comment.');
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/api_comment/comments/${resourceId}`, {
        comment: newComment
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setComments(prevComments => [response.data.comment, ...prevComments]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteComment = async (commentId, commentUserId) => {
    if (userId === commentUserId || isAdmin) {
      try {
        // Removed 'const response =' as it's not being used.
        await axios.delete(`${backendURL}/api_comment/delete/${commentId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    } else {
      alert('You are not authorized to delete this comment.');
    }
  };


  const updateComment = async (commentId, updatedCommentText) => {
    if (!isLoggedIn) {
      alert('You need to log in to update a comment.');
      return;
    }

    try {
      const response= await axios.put(`${backendURL}/api_comment/update/${commentId}`, {
        NewComment: updatedCommentText
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Assuming the updated comment is returned in the response. Adjust as needed.
      setComments(prevComments => prevComments.map(comment => comment.id === commentId ? response.data.comment : comment));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  if (!resource) {
    return <div>Loading resource...</div>;
  }

  return (
    <div className="resource-page">
      <Header />
      <div className="resource-content">
        <h1>{resource.title}</h1>
        <p><strong>Author:</strong> {resource.author}</p>
        <p><strong>Description:</strong> {resource.description}</p>
        {/* Add additional resource details here */}
      </div>
      <div className="comments-container">
      <Comments 
      comments={comments} 
      addComment={addComment} 
      deleteComment={deleteComment}
      updateComment={updateComment}
      userAuthenticated={isLoggedIn}
      isAdmin={isAdmin}
      currentUserId={userId} 
    />
      </div>
    </div>
  );
};

export default ResourcePage;

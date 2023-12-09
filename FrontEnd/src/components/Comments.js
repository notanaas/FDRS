import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './Comments.css';

const Comments = ({ resourceId }) => {
    const { user, authToken, isLoggedIn, isAdmin } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [editing, setEditing] = useState({ id: null, text: '' });
    const [newComment, setNewComment] = useState('');
    const backendURL = 'http://localhost:3002';
    const userId = user?._id;
    const [sortOrder, setSortOrder] = useState('newest'); // State to control sort order
    const handleSort = () => {
      // Toggle sort order between 'newest' and 'oldest'
      setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
    };
  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_resource/resource-detail/${resourceId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (Array.isArray(response.data.comments)) {
        setComments(response.data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };
  useEffect(() => {
    if (resourceId) {
      fetchComments();
    }
  }, [resourceId, authToken, backendURL]);

  const handleTextChange = (e) => {
    setNewComment(e.target.value);
  };

  const addComment = async () => {
    if (!isLoggedIn) {
      alert('Please log in to add a comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(`${backendURL}/api_comment/add/${resourceId}`, {
        text: newComment,
        userId: user?._id, // Include the user ID from the AuthContext
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNewComment('');
      fetchComments(); 
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    const commentToDelete = comments.find(comment => comment._id === commentId);
  
    if (!isLoggedIn || (!isAdmin && userId !== commentToDelete.User._id)) {
      alert('You are not authorized to delete this comment.');
      return;
    }
  
    try {
      await axios.delete(`${backendURL}/api_comment/delete/${resourceId}/${commentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { commentId: commentId }, 
      });
  
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  
  const saveUpdatedComment = async (commentId) => {
    if (!isLoggedIn) {
      alert('You need to log in to update a comment.');
      return;
    }

    if (editing.text.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.put(`${backendURL}/api_comment/update/${commentId}`, {
        NewComment: editing.text,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        setComments(comments.map(comment => 
          comment._id === commentId ? { ...comment, Comment: editing.text } : comment
        ));
        setEditing({ id: null, text: '' });
      } else {
        console.error('Failed to update comment.');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const canEditOrDeleteComment = (comment) => {
    const commentOwnerId = comment.User._id || comment.User; 
    return isLoggedIn && (isAdmin || (user && user._id === commentOwnerId));  };

    const sortedComments = comments.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.Created_date) - new Date(a.Created_date);
      } else {
        return new Date(a.Created_date) - new Date(b.Created_date);
      }
    });
  
  return (
    <div className="comments-container">
<h2 className="comments-title">Comments</h2>
     <button className="authButton sortButton" onClick={handleSort}>
        Sort by {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
      </button>
    <div className="comments-list">
      {sortedComments.map(comment => (
        <div key={comment._id} className="comment">
          <div className="comment-header">
            <span className="comment-author">{comment.User.Username || 'Anonymous'}</span>
            <span className="comment-date">{new Date(comment.Created_date).toLocaleString()}</span>
          </div>
          <div className="comment-body">
            {editing.id === comment._id ? (
              <textarea
                className="inputBar"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              />
            ) : (
              <p>{comment.Comment}</p> 
            )}
          </div>
          {canEditOrDeleteComment(comment) && (
            <div className="comment-actions">
              {editing.id === comment._id ? (
                <button className="authButton" onClick={() => saveUpdatedComment(comment._id)}>Save</button>
              ) : (
                <button className="authButton" onClick={() => setEditing({ id: comment._id, text: comment.Comment })}>
                  Edit
                </button>
              )}
              <button className="authButton" onClick={() => deleteComment(comment._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
    {isLoggedIn && (
      <div className="add-comment">
        <textarea
          value={newComment}
          className="inputBar"
          onChange={handleTextChange}
          placeholder="Write your comment..."
        />
        <button className="authButton" onClick={addComment}>Post Comment</button>
      </div>
    )}
  </div>
);
};

export default Comments;

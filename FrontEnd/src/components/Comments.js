import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Comments = ({ resourceId, userId, isLoggedIn, authToken, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState({ id: null, text: "" });
  const [newComment, setNewComment] = useState('');
  const backendURL = 'http://localhost:3002';

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_resource/resource-detail/${resourceId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

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
      const response = await axios.post(`${backendURL}/api_comment/add/${resourceId}`, {
        text: newComment,
        userId,
        resourceId
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setNewComment('');
      fetchComments(); // Fetch comments again to update the list
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!isAdmin) {
      alert('You are not authorized to delete this comment.');
      return;
    }

    try {
      await axios.delete(`${backendURL}/api_comment/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
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
      alert('Comment cannot be empty');
      return;
    }

    try {
      await axios.put(`${backendURL}/api_comment/update/${commentId}`, {
        text: editing.Comment // Make sure this matches your backend's expected field
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, Comment: editing.text } : comment
        )
      );
      setEditing({ id: null, text: "" }); // Reset editing state
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  const canDeleteComment = (commentUserId) => {
    return isAdmin || userId === commentUserId;
  };
  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.User.Username || 'Anonymous'}</span>
              <span className="comment-date">{new Date(comment.Created_date).toLocaleString()}</span>
            </div>
            <div className="comment-body">
              {editing.id === comment._id ? (
                <textarea
                  value={editing.text}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                />
              ) : (
                <p>{comment.Comment}</p>
              )}
            </div>
            <div className="comment-actions">
              {isLoggedIn && canDeleteComment(comment.userId) && (
                <>
                  {editing.id === comment._id ? (
                    <button onClick={() => saveUpdatedComment(comment._id)}>Save</button>
                  ) : (
                    <button onClick={() => setEditing({ id: comment._id, text: comment.Comment })}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => deleteComment(comment._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {isLoggedIn ? (
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={handleTextChange}
            placeholder="Write your comment..."
          />
          <button onClick={addComment}>Post Comment</button>
        </div>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
    </div>
  );
};

export default Comments;

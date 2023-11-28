import React, { useState,useEffect } from 'react';
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
      await axios.post(`${backendURL}/api_comment/add/${resourceId}`, {
        text: newComment,
        userId, 
        resourceId
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setNewComment('');
      // You might want to fetch and update the comments list here
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  const deleteComment = async (commentId) => {
    // Additional logic to confirm deletion could be added here
    if (!isAdmin) {
      alert('You are not authorized to delete this comment.');
      return;
    }

    try {
      await axios.delete(`${backendURL}/api_comment/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const updateComment = async (commentId) => {
    if (!isLoggedIn) {
      alert('You need to log in to update a comment.');
      return;
    }

    const updatedCommentText = prompt('Edit your comment:');
  
    if (updatedCommentText !== null && updatedCommentText.trim() !== '') {
      try {
        const response = await axios.put(`${backendURL}/api_comment/update/${commentId}`, {
          NewComment: updatedCommentText
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, text: updatedCommentText } : comment
          )
        );
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };
  

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <div className="comment-header">
            <span className="comment-author">{comment.user?.name || 'Anonymous'}</span>
            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div className="comment-body">
            <p>{comment.text}</p>
          </div>
          <div className="comment-actions">
      {isLoggedIn && comment.userId === userId && (
        <>
          {editing.id === comment.id ? (
            <button onClick={() => updateComment(comment.id)}>Save</button>
          ) : (
            <button onClick={() => setEditing({ id: comment.id, text: comment.text })}>
              Edit
            </button>
          )}
        </>
      )}
      {isAdmin && (
        <button onClick={() => deleteComment(comment.id)}>Delete</button>
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
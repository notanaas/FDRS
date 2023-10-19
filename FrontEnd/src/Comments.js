import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ resourceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/resources/${resourceId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  const submitComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(`/api/resources/${resourceId}/comments`, { comment: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={submitComment}>Submit</button>
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.Comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;

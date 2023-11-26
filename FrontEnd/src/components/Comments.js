import React, { useState } from 'react';

const Comments = ({ comments, addComment, deleteComment, userAuthenticated, isAdmin, currentUserId }) => {
  const [newComment, setNewComment] = useState({ text: '' });

  const handleTextChange = (e) => {
    setNewComment({ ...newComment, text: e.target.value });
  };

  const addNewComment = () => {
    if (newComment.text.trim()) {
      addComment(newComment);
      setNewComment({ text: '' });
    }
  };

  return (
    <div className="comments">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <strong>{comment.author}:</strong> {comment.text}
          {(isAdmin || comment.userId === currentUserId) && (
            <button onClick={() => deleteComment(comment.id, comment.userId)}>Delete</button>
          )}
        </div>
      ))}
      <div className="add-comment">
        <h3>Add a Comment</h3>
        <div className="comment-form">
          {userAuthenticated ? (
            <>
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

export default Comments;

import React, { useState } from 'react';

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

export default Comments;

import React, { useState, useContext,useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

const FeedbackForm = () => {
  const { user, authToken,isLoggedIn } = useContext(AuthContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendURL = 'http://localhost:3002';

  const handleFeedbackChange = (e) => {
    setFeedbackText(e.target.value);
  };
  const promptLogin = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 4000); 
  };
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_feedback/feedbacks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const submitFeedback = async () => {
    console.log('Feedback submit button clicked'); // For debugging
  
    if (!isLoggedIn) {
      promptLogin();
      return;
    }
  
    if (!user || !user._id) {
      console.error('User data is not available for feedback submission.');
      return;
    }
  
    try {
      const response = await axios.post(`${backendURL}/api_feedback/FeedBack-post`, {
        User: user._id, 
        SearchText: searchTerm,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}` 
        }
      });
  
      console.log('Feedback submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Call fetchFeedbacks when the component mounts
  useEffect(() => {
    fetchFeedbacks();
  }, []); // Empty dependency array ensures it runs once after the initial render

  return (
    <div>
      {isLoading ? (
        <p>Loading feedbacks...</p>
      ) : (
        <div>
          <ul>
            {feedbacks.map((feedback) => (
              <li key={feedback.id}>{feedback.text}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <textarea
          value={feedbackText}
          onChange={handleFeedbackChange}
          placeholder="Write your feedback here..."
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FeedbackForm;

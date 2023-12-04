import React, { useState, useContext,useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import './App.css';

const FeedbackForm = ({searchTerm}) => {
  const { user, authToken,isLoggedIn } = useContext(AuthContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

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
    if (!isLoggedIn) {
      // Handle the case where the user is not logged in
      console.log('User must be logged in to submit feedback.');
      return;
    }
    
    if (!user || !user._id) {
      // If the user data is not available, log an error or set an error state
      console.error('User data is not available for feedback submission.');
      setError('User data is not available. Please log in again.');
      return;
    }
    try {
      const response = await axios.post(`${backendURL}/api_feedback/FeedBack-post`, {
        User: user._id,
        SearchText: searchTerm,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
                },
      });

      console.log('Feedback submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  useEffect(() => {
    if (isLoggedIn && user && user._id) {
      // Trigger the feedback submission
      submitFeedback();
    } else {
      console.error('You must be logged in to submit feedback.');
    }
  }, [searchTerm,isLoggedIn, user]);
  
  return (
    <div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FeedbackForm;

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const FeedbackForm = ({ authToken, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearchPrompt, setShowSearchPrompt] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes('/faculty/');
  const backendURL = 'http://localhost:3002';
  const authContext = useContext(AuthContext);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  useEffect(() => {
    if (searchPerformed && searchResults.length === 0) {
      setShowSearchPrompt(true);
      setShowButton(true); 
      const timer = setTimeout(() => {
        setShowSearchPrompt(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [searchPerformed, searchResults]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setSearchPerformed(true); 
    try {
      const response = await axios.get(`${backendURL}/api_resource/search`, {
        params: { term: searchTerm },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSearchResults(response.data);
      onSearchResults(response.data); 
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const submitFeedback = async () => {
    const { user } = authContext;
    if (!user) {
      console.error('User is not logged in.');
      setFeedbackError('User is not logged in.');
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/api_feedback/feedback-post`, {
        User: user._id,
        SearchText: searchTerm,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setSearchTerm('');
      setFeedbackSuccess(response.data.message); // Set success message from response
    } catch (error) {
      console.error('Feedback submission error:', error);
      setFeedbackError(error.response?.data?.message || 'An error occurred while submitting feedback.');
    }
  };

  return (
    <div className='search'>
      {isFacultyPage && (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search or submit feedback"
            value={searchTerm}
            onChange={handleInputChange}
            style={{
              borderRadius: '10px 0 0 10px',
              border: '1px solid #ccc',
              flexGrow: 1,
              fontSize: 'medium',
              fontWeight: '600',
              padding: '6px',
              border: '2px solid #ccc',
            }}
          />
          <button
            className="authButtonsearch"
            onClick={handleSearch}
            style={{
              borderRadius: '0 10px 10px 0',
              cursor: 'pointer',
              height: '34px',
              width: '40px',
              backgroundColor: '#eee',
              border: '2px solid #ccc',
              marginLeft: '-2px',
            }}
          >
            <svg height="17" viewBox="0 0 1792 1792" width="17" xmlns="http://www.w3.org/2000/svg"><path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z" /></svg>
          </button>
          {searchPerformed && searchResults.length === 0 && showButton && (
            <button
              className="authButton"
              onClick={submitFeedback}
              style={{
                padding: '10px 20px',
                margin: '5px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'green',
                color: 'white'
              }}
            >
              Submit Feedback
            </button>
          )}
        </div>
      )}
       {feedbackSuccess && (
        <div className='feedbackSuccess'>
          {feedbackSuccess}
        </div>
      )}

      {feedbackError && (
        <div className='feedbackError'>
          {feedbackError}
        </div>
      )}
      {showSearchPrompt && (
        <div className='noResults'>
          <p>No results found. Would you like to submit your search as feedback?</p>
        </div>
      )}
      {searchPerformed && searchResults.length > 0 && (
        <div>
          {searchResults.map((result) => (
            <div key={result.id}>{result.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;

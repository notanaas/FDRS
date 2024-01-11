import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';

const FeedbackForm = ({ authToken, onSearch, showFeedbackButton }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearchPrompt, setShowSearchPrompt] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes('/faculty/');
  const backendURL = 'http://localhost:3002';
  const authContext = useContext(AuthContext);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const { routeParams } = useContext(RouteParamsContext);
  const facultyId = routeParams ? routeParams.facultyId : null;
  useEffect(() => {
    // Set a delay for debouncing
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);


  
  useEffect(() => {
    if (showFeedbackButton) {
      setShowSearchPrompt(true);
      setShowButton(true); 
      const timer = setTimeout(() => {
        setShowSearchPrompt(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showFeedbackButton]);

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // If the search term is empty, send an empty string as the search query
    if (newSearchTerm === '') {
      onSearch('', facultyId);
    }
  };

  const handleSearch = async () => {
    onSearch(debouncedSearchTerm,facultyId);
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
      setFeedbackError('You need to add more than 5 character.');
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
          {showFeedbackButton && (
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
      
    </div>
  );
};

export default FeedbackForm;

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const FeedbackForm = ({ authToken }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearchPrompt, setShowSearchPrompt] = useState(false);

  const location = useLocation();
  const isFacultyPage = location.pathname.includes('/faculty/');
  const backendURL = 'http://localhost:3002';
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (searchPerformed && searchResults.length === 0) {
      setShowSearchPrompt(true);
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
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const submitFeedback = async () => {
    if (!user) {
      console.error('User is not logged in.');
      return;
    }

    try {
      await axios.post(`${backendURL}/api_feedback/feedback-post`, {
        User: user._id,
        SearchText: searchTerm,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <div>
      {isFacultyPage && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search or submit feedback"
            value={searchTerm}
            onChange={handleInputChange}
            style={{
              padding: '10px',
              margin: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              flexGrow: 1
            }}
          />
          <button
            className="authButton"
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              margin: '5px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white'
            }}
          >
            Search
          </button>
          {searchPerformed && searchResults.length === 0 && (
            <button
              className="authButton"
              onClick={submitFeedback}
              style={{
                padding: '10px 20px',
                margin: '5px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#28a745',
                color: 'white'
              }}
            >
              Submit Feedback
            </button>
          )}
        </div>
      )}
      {showSearchPrompt && (
        <div
          style={{
            backgroundColor: 'orange',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '5px',
            color: 'white'
          }}
        >
          No results found. Would you like to submit your search as feedback?
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

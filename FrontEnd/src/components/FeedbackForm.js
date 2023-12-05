import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import DocumentCard from './DocumentCard';
import { useLocation } from 'react-router-dom';

const FeedbackForm = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const { user, authToken, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes(`/faculty/`); // Determine if it's the faculty page
  const backendURL = 'http://localhost:3002';


  const handleInputChange = (e) => {
    setsearchTerm(e.target.value);
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
      await axios.post(`${backendURL}/api_feedback/FeedBack-post`, {
        User: user._id,
        SearchText: searchTerm, 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      setsearchTerm(''); 
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  };
 
  const submitFeedbackSection = isFacultyPage && (
    <>
      <input
        type="text"
        value={searchTerm}
        className='inputBar'
        onChange={handleInputChange}
        placeholder="Search or submit feedback"
      />
      <button className="authButton" onClick={handleSearch}>Search</button>

      {searchPerformed && searchResults.length === 0 && (
        <>
          <p>No results found. Would you like to submit your search as feedback?</p>
          <button className="authButton" onClick={submitFeedback}>Submit Feedback</button>
        </>
      )}
    </>
  );

  return (
    <div>
    

   {submitFeedbackSection}

   {searchPerformed && searchResults.length > 0 && (
     searchResults.map(result => (
       <div key={result.id}>{result.title}</div>
     ))
   )}
 </div>
);
};


export default FeedbackForm;

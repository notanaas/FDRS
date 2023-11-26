import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard'; 
import axios from 'axios';

const FacultyPage = ({ match }) => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const backendURL = 'http://localhost:3002'; 

  useEffect(() => {
    const fetchResources = async () => {
      const url = `${backendURL}/api_resource/faculty/${match.params.facultyId}`;
      console.log('Requesting URL:', url); // Log the URL being requested

      try {
        const response = await axios.get(url);
        console.log('Resources fetched:', response.data); // Log the response data
        setResources(response.data.Resource_list);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message);
      }
    };

    fetchResources();
  }, [match.params.facultyId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="faculty-page">
      <h1>Faculty Resources</h1>
      <div className="resources-container">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <DocumentCard key={resource._id} document={resource} />
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;

import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard'; 
import axios from 'axios';

const FacultyPage = ({ facultyId }) => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const backendURL = 'http://localhost:3002'; 

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(response.data.Resource_list); // Assuming the backend sends the data in this key
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message);
      }
    };

    if (facultyId) {
      fetchResources();
    }
  }, [facultyId]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
    <h1>Resources</h1>
    {resources.length > 0 ? (
      resources.map((resource, index) => (
        <div key={index}>
          <h2>{resource.ResourceTitle}</h2>
          <p>{resource.ResourceAuthor}</p>
        </div>
      ))
    ) : (
      <p>No resources found for this faculty.</p>
    )}
  </div>
);
};

export default FacultyPage;

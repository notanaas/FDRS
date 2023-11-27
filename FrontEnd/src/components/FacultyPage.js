import React, { useState, useEffect,useContext } from 'react';
import DocumentCard from './DocumentCard'; 
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { RouteParamsContext } from './context/RouteParamsContext'; // Import the provider

const FacultyPage = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const backendURL = 'http://localhost:3002';
  const { facultyId } = useParams();
  const { setRouteParams } = useContext(RouteParamsContext);

  useEffect(() => {
    setRouteParams({ facultyId });
  }, [facultyId, setRouteParams]);
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(response.data.resource_list); 
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching resources.');
      }
    };

    fetchResources();
  }, [facultyId]); 

  const handleCardClick = (resourceId) => {
    history.push(`/resource/${resourceId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Resources for Faculty</h1>

      {resources.length > 0 ? (
        resources.map((resource) => (
          <DocumentCard key={resource._id} document={resource} onClick={() => handleCardClick(resource._id)} />
        ))
      ) : (
        <p>No resources found for this faculty.</p>
      )}
    </div>
  );
};

export default FacultyPage;

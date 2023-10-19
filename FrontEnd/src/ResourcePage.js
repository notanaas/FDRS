import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments'; 

const ResourcePage = () => {
  const [resource, setResource] = useState(null);
  const { resourceId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`/api/resources/${resourceId}`);
        setResource(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching resource:', error);
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!resource) {
    return <div>Resource not found.</div>;
  }

  return (
    <div className="resource-page">
      <Header />
      <h1>{resource.title}</h1>
      <p>Author: {resource.author}</p>
      <Comments resourceId={resourceId} /> {/* Add the Comments component here */}
      <div className="resource-content">
        <h2>{resource.title}</h2>
        <p>Author: {resource.author}</p>
        <div className="resource-description">
          {resource.description && (
            <div>
              <strong>Description:</strong> {resource.description}
            </div>
          )}
        </div>
        <div className="resource-image">
          {resource.photo && <img src={resource.photo} alt="Document" />}
        </div>
        <div className="resource-download">
          {resource.file ? (
            <a
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.title || 'document'}
            >
              Download Document
            </a>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResourcePage;

import React, { useState, useEffect } from 'react';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';
import Header from './Header';
import Footer from './Footer'; // Import Footer
import { useParams } from 'react-router-dom'; // Import useParams
import { useDarkMode } from './DarkModeContext'; // Import useDarkMode

const ResourcePage = ({ resources }) => {
  const { resourceId } = useParams();
  const resource = resources[resourceId];
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Define isDarkMode and toggleDarkMode

  if (!resource) {
    // Handle the case where the resource is not found.
    return <div>Resource not found</div>;
  }

  return (
    <div>
      <Header />
      <h2>{resource.title}</h2>
      <p>Author: {resource.author}</p>
      <p>Resource ID: {resource.id}</p>
      {/* Add more details about the resource here */}
      <Footer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default ResourcePage;
